import { useEffect, useRef, useState, HTMLAttributes } from 'react';
import VideoWebcam from 'react-webcam';
import styled from 'styled-components';
import {
    SelfieSegmentation,
    Results as SelfieSegmentationResults,
} from '@mediapipe/selfie_segmentation'; // TODO: check requirements needed for support
import { Camera } from '@mediapipe/camera_utils';

import { useConfig } from '../hooks/Authenticated/Config';

import loadImage from '../utils/loadImage';
import sleep from '../utils/sleep';
import { webcamBackgrounds } from '../utils/webcamBackgrounds';

const Container = styled.div`
    position: relative;
    width: 100%;
    padding: 0.25rem;
    margin: 0 auto;

    video {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: auto;
        visibility: hidden;
    }

    canvas {
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        transform: scaleX(-1);
        background-size: cover;
        border-radius: 0.5rem;
        /* visibility: hidden; */
    }
`;

// TODO: test on a device without webcam and blocking browser access to camera and microphone
// TODO: HELP - When closing and opening camera many times, after 7/8 times, rises ram usage and slow down rendering
// TODO: HELP - When disable camera, then mic, mic cannot be disabled/enabled. When disable mic, then camera, camera led doesn't turn off, but stream stops. When disable mic, cannot be enabled.
export default function Webcam({ ...props }: HTMLAttributes<HTMLDivElement>) {
    const webcamRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef(null);
    const audioTracks = useRef<MediaStreamTrack[]>([]);
    const originalVideoTracks = useRef<MediaStreamTrack[]>([]);
    const unifiedStream = useRef<MediaStream>(new MediaStream());
    const backgroundRef = useRef<HTMLImageElement>(null);
    const backgroundTypeRef = useRef<WebcamBackgroundTypes>();
    const selfieSegmentationRef = useRef<SelfieSegmentation>(null);

    const {
        webcamBackground,
        virtualBackgroundSupported,
        setWebcamBackground,
        webcamDeviceId,
        microphoneDeviceId,
        isWebcamEnabled,
        isMicrophoneEnabled,
        webcamStream,
        setIsWebcamStreamAvailable,
    } = useConfig();

    useEffect(() => {
        onFrame();
    }, []);

    useEffect(() => {
        if (!isWebcamEnabled) {
            originalVideoTracks.current.forEach(track => {
                track.enabled = false;
                track.stop();
            });
        }

        if (!isMicrophoneEnabled) {
            audioTracks.current.forEach(track => {
                track.enabled = false;
                track.stop();
            });
        }

        if (!isMicrophoneEnabled && !isWebcamEnabled) {
            alert('Microfone e video não habilitados');
            return;
        }

        navigator.mediaDevices
            .getUserMedia({
                audio: isMicrophoneEnabled
                    ? { deviceId: microphoneDeviceId, echoCancellation: true }
                    : false,
                video: isWebcamEnabled
                    ? { deviceId: webcamDeviceId, width: 1280, height: 720 }
                    : false,
            })
            .then(stream => {
                webcamRef.current.srcObject = stream;
                originalVideoTracks.current = stream.getVideoTracks();
                audioTracks.current = stream.getAudioTracks();

                webcamRef.current.play();

                unifyStreams();
            })
            .catch(err => console.error(err)); //TODO: handle error
    }, [isWebcamEnabled, isMicrophoneEnabled]);

    useEffect(() => {
        if (webcamBackground.type === 'image')
            loadImage(webcamBackground.image).then(async image => {
                backgroundRef.current = image;
            });

        backgroundTypeRef.current = webcamBackground.type;
    }, [webcamBackground]);

    useEffect(() => {
        if (!virtualBackgroundSupported) {
            // Mock selfie segmentation if virtual background is not supported and someone try to force it
            selfieSegmentationRef.current = {} as SelfieSegmentation;

            selfieSegmentationRef.current.send = async (_: any) => {
                setWebcamBackground(webcamBackgrounds.camera[0]);
            };
            return;
        }

        selfieSegmentationRef.current = new SelfieSegmentation({
            locateFile: file => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            },
        });
        selfieSegmentationRef.current.setOptions({
            modelSelection: 1,
        });
        selfieSegmentationRef.current.onResults(onSelfieSegmentationResults);
    }, [virtualBackgroundSupported]);

    const unifyStreams = async () => {
        const video = canvasRef.current.captureStream(30);

        unifiedStream.current = new MediaStream();

        for (const track of [...audioTracks.current, ...video.getTracks()]) {
            unifiedStream.current.addTrack(track);
        }

        console.log('unifiedStream', unifiedStream.current.getTracks());

        webcamStream.current = unifiedStream.current;

        setIsWebcamStreamAvailable(true);
    };

    // TODO: handle disable camera when background type is enabled
    const onFrame = async () => {
        while (true) {
            if (!isWebcamEnabled) {
                console.log('EPA');
                return;
            }

            switch (backgroundTypeRef.current) {
                case 'blur':
                case 'image':
                    await selfieSegmentationRef.current.send({
                        image: webcamRef.current,
                    });

                    break;

                case 'normal':
                default:
                    await drawCameraOnCanvas();
                    break;
            }

            await sleep(1000 / 30);
            console.log('frame');
        }
    };

    const drawCameraOnCanvas = async () => {
        if (!canvasRef.current || !webcamRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx.drawImage(
            webcamRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
    };

    const onSelfieSegmentationResults = (
        results: SelfieSegmentationResults,
    ) => {
        if (!canvasRef.current || !webcamRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();

        if (
            backgroundTypeRef.current === 'image' &&
            backgroundRef.current instanceof HTMLImageElement
        ) {
            canvasCtx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );
            canvasCtx.drawImage(
                results.segmentationMask,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );

            canvasCtx.globalCompositeOperation = 'source-in';
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );

            canvasCtx.globalCompositeOperation = 'destination-atop';

            canvasCtx.drawImage(
                backgroundRef.current,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );
        } else {
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );

            // Make all pixels not in the segmentation mask transparent
            canvasCtx.globalCompositeOperation = 'destination-atop';
            canvasCtx.drawImage(
                results.segmentationMask,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );

            // Blur the context for all subsequent draws then set the raw image as the background
            canvasCtx.filter = 'blur(12px)';
            canvasCtx.globalCompositeOperation = 'destination-over';
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );
        }

        canvasCtx.restore();
    };

    return (
        <Container {...props}>
            <video
                ref={webcamRef}
                controls
                width={1280}
                height={720}
                muted={true}
            />
            <canvas ref={canvasRef} width={1280} height={720} />
        </Container>
    );
}
