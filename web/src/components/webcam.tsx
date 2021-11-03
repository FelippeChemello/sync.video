import { useEffect, useRef, useState, HTMLAttributes } from 'react';
import VideoWebcam from 'react-webcam';
import styled from 'styled-components';
import {
    SelfieSegmentation,
    Results as SelfieSegmentationResults,
} from '@mediapipe/selfie_segmentation'; // TODO: check requirements needed for support
import { Camera } from '@mediapipe/camera_utils';

import { useConfig } from '../hooks/Config';

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
    }
`;

export default function Webcam({ ...props }: HTMLAttributes<HTMLDivElement>) {
    const webcamRef = useRef<VideoWebcam>(null);
    const canvasRef = useRef(null);
    const backgroundRef = useRef<HTMLImageElement>(null);
    const backgroundTypeRef = useRef<WebcamBackgroundTypes>();
    const selfieSegmentationRef = useRef<SelfieSegmentation>(null);

    const {
        webcamBackground,
        virtualBackgroundSupported,
        setWebcamBackground,
        setWebcamStream,
        webcamDeviceId,
        microphoneDeviceId,
    } = useConfig();

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

    useEffect(() => {
        if (
            typeof webcamRef.current === 'undefined' ||
            webcamRef.current === null
        )
            return;

        const camera = new Camera(webcamRef.current.video, {
            onFrame,
            width: 1280,
            height: 720,
        });

        canvasRef.current.width = webcamRef.current.video.clientWidth;
        canvasRef.current.height = webcamRef.current.video.clientHeight;

        camera.start();

        unifyStreams();
    }, [webcamRef]);

    const unifyStreams = async () => {
        do {
            await sleep(100);
        } while (!webcamRef.current.stream?.getAudioTracks());

        canvasRef.current.width = webcamRef.current.video.clientWidth;
        canvasRef.current.height = webcamRef.current.video.clientHeight;

        const audio = webcamRef.current.stream.getAudioTracks();
        const video = canvasRef.current.captureStream(30);

        const mediaStream = new MediaStream();

        [...audio, ...video.getTracks()].forEach(track =>
            mediaStream.addTrack(track),
        );

        setWebcamStream(mediaStream);
    };

    const onFrame = async () => {
        switch (backgroundTypeRef.current) {
            case 'blur':
            case 'image':
                await selfieSegmentationRef.current.send({
                    image: webcamRef.current.video,
                });
                break;

            case 'normal':
            default:
                await drawCameraOnCanvas();
                break;
        }
    };

    const drawCameraOnCanvas = async () => {
        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx.drawImage(
            webcamRef.current.video,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
    };

    const onSelfieSegmentationResults = (
        results: SelfieSegmentationResults,
    ) => {
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
            <VideoWebcam
                ref={webcamRef}
                audio={true}
                muted={true}
                onLoadedData={unifyStreams}
                videoConstraints={{
                    deviceId: webcamDeviceId,
                    width: 1280,
                    height: 720,
                }}
                audioConstraints={{
                    deviceId: microphoneDeviceId,
                    echoCancellation: true,
                }}
            />
            <canvas ref={canvasRef} />
        </Container>
    );
}
