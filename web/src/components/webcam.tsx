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

type WebcamProps = {
    setWebcamStream: (stream: MediaStream) => void;
};

type BackgroundType = 'normal' | 'blur' | 'image';

export default function Webcam({ setWebcamStream }: WebcamProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webcamRef = useRef<VideoWebcam>(null);
    const [bodyPixNeuralNetwork, setBodyPixNeuralNetwork] =
        useState<bodyPix.BodyPix>();
    const [backgroundType, setBackgroundType] =
        useState<BackgroundType>('image'); // TODO: Initialize with normal and when bodypix model loaded, allow other types, if WebGL is available
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
        '../assets/cinema-bg.jpg', // TODO: add more images
    );
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
    // TODO: add warning when device doesn't have webcam or bodyPix (webGL or WASM) nor supported

    useEffect(() => {
        console.log('Loading bodyPix model...');

        bodyPix.load().then(model => {
            console.log('bodyPix model loaded!');
            setBodyPixNeuralNetwork(model);
        });
    }, []);

    useEffect(() => {
        loadImage(backgroundImageUrl).then(setBackgroundImage);
    }, [backgroundImageUrl]);

    async function initWebcam() {
        console.log('Initializing webcam...');

        const webcam = webcamRef.current.video;
        const canvas = canvasRef.current;

        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;

        unifyStreams();

        drawCanvas();
    }

    async function unifyStreams() {
        const audio = webcamRef.current.stream.getAudioTracks();
        const video = canvasRef.current.captureStream(60);

        const mediaStream = new MediaStream();

        [...audio, ...video.getTracks()].forEach(track =>
            mediaStream.addTrack(track),
        );

        setWebcamStream(mediaStream);
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

        const segmentation = await bodyPixNeuralNetwork.segmentPerson(webcam);
        const mask = bodyPix.toMask(segmentation);

        const maskCanvas = document.createElement('canvas');
        const tmpContext = maskCanvas.getContext('2d');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;

        // Draw Mask
        tmpContext.putImageData(mask, 0, 0);
        context.drawImage(backgroundImage, 0, 0);
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        context.save();
        context.globalCompositeOperation = 'destination-out'; // Remove Masked area from webcam
        context.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
        context.restore();

        context.save();
        context.globalCompositeOperation = 'destination-over'; // Add image  below webcam
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        context.restore();
    }

    async function loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;

            image.onload = () => resolve(image);
            image.onerror = error => reject(error);
        });
    }

    async function drawWithBlur() {
        const canvas = canvasRef.current;
        const webcam = webcamRef.current.video;

        const segmentation = await bodyPixNeuralNetwork.segmentPerson(webcam);

        bodyPix.drawBokehEffect(canvas, webcam, segmentation, 14, 1, false);
    }

    return (
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
    );
}
