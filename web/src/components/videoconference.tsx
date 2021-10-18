import { useEffect, useRef, useState } from 'react';
import VideoWebcam from 'react-webcam';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    width: 100%;
    margin: 20px;
    margin: 0 auto;

    video {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        height: auto;
        visibility: hidden;
    }

    canvas {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        transform: scaleX(-1);
        background-size: cover;
    }
`;

type VideoConferenceProps = {
    peer: any;
};

type BackgroundType = 'normal' | 'blur' | 'image';

export default function VideoConference({ peer }: VideoConferenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webcamRef = useRef<VideoWebcam>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [bodyPixNeuralNetwork, setBodyPixNeuralNetwork] =
        useState<bodyPix.BodyPix>();
    const [backgroundType, setBackgroundType] =
        useState<BackgroundType>('blur');
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
        '../assets/cinema-bg.jpg', // TODO: add more images
    );

    useEffect(() => {
        console.log('Loading bodyPix model...');

        bodyPix.load().then(model => {
            console.log('bodyPix model loaded!');
            setBodyPixNeuralNetwork(model);
        });
    }, []);

    async function initWebcam() {
        console.log('Initializing webcam...');

        const webcam = webcamRef.current.video;
        const canvas = canvasRef.current;

        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;

        const audio = webcamRef.current.stream.getAudioTracks();
        const video = canvasRef.current.captureStream(24);

        const mediaStream = new MediaStream();
        [...audio, ...video.getTracks()].forEach(track =>
            mediaStream.addTrack(track),
        );

        console.log(mediaStream);

        videoRef.current.srcObject = mediaStream;

        drawCanvas();
    }

    async function drawCanvas() {
        requestAnimationFrame(drawCanvas);

        switch (backgroundType) {
            case 'blur':
                await drawWithBlur();
                break;
            case 'image':
                await drawWithImage();
                break;
            case 'normal':
            default:
                await drawWebcam();
                break;
        }
    }

    async function drawWebcam() {
        const webcam = webcamRef.current.video;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    }

    async function drawWithImage() {
        const webcam = webcamRef.current.video;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.style.backgroundImage = `url(${backgroundImageUrl})`;

        const segmentation = await bodyPixNeuralNetwork.segmentPerson(webcam);
        const mask = bodyPix.toMask(segmentation);

        const tmpCanvas = document.createElement('canvas');
        const tmpContext = tmpCanvas.getContext('2d');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        tmpContext.putImageData(mask, 0, 0);

        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        context.save();
        context.globalCompositeOperation = 'destination-out';
        context.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height);
        context.restore();
    }

    async function drawWithBlur() {
        const canvas = canvasRef.current;
        const webcam = webcamRef.current.video;

        const segmentation = await bodyPixNeuralNetwork.segmentPerson(webcam);

        bodyPix.drawBokehEffect(canvas, webcam, segmentation, 14, 1, false);
    }

    return (
        <>
            <Container>
                <VideoWebcam
                    audio={true}
                    mirrored={true}
                    ref={webcamRef}
                    onLoadedData={initWebcam}
                    height={480}
                    width={640}
                    muted={true}
                />
                <canvas ref={canvasRef} />
            </Container>
            <video ref={videoRef} autoPlay={true}></video>
        </>
    );
}
