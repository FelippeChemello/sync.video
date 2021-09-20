import { useEffect, useRef, useState } from 'react';
import VideoWebcam from 'react-webcam';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import styled from 'styled-components';

const Container = styled.div`
    width: 10px;

    video {
        /* visibility: hidden; */
        width: 0;
    }

    canvas {
        width: 100%;
        background-color: blue;
    }
`;

export default function Webcam() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webcamRef = useRef<VideoWebcam>(null);
    const [bodypixnet, setBodypixnet] = useState<bodyPix.BodyPix>();

    useEffect(() => {
        bodyPix.load().then((net: bodyPix.BodyPix) => {
            setBodypixnet(net);
        });
    }, []);

    const drawimage = async () => {
        const webcam = webcamRef?.current?.video as HTMLVideoElement;
        const canvas = canvasRef.current;

        if (!canvas || !webcam) return;

        webcam.width = canvas.width = webcam.videoWidth;
        webcam.height = canvas.height = webcam.videoHeight;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!bodypixnet) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = webcam.videoWidth;
        tempCanvas.height = webcam.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        const segmentation = await bodypixnet.segmentPerson(webcam);
        const mask = bodyPix.toMask(segmentation);

        (async function drawMask() {
            requestAnimationFrame(drawMask);
            // draw mask on tempCanvas
            const segmentation = await bodypixnet.segmentPerson(webcam);
            const mask = bodyPix.toMask(segmentation);
            tempCtx.putImageData(mask, 0, 0);
            // draw original image
            context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
            // use destination-out, then only masked area will be removed
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            context.restore();
        })();
    };

    return (
        <Container>
            <VideoWebcam
                audio={false}
                ref={webcamRef}
                // onLoadedData={drawimage}
            />
            <canvas ref={canvasRef} />
        </Container>
    );
}
