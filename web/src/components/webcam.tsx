import { useEffect, useRef, useState, MutableRefObject } from 'react';
import styled from 'styled-components';
import {
    BsMicFill,
    BsMicMuteFill,
    BsCameraVideoFill,
    BsCameraVideoOffFill,
} from 'react-icons/bs';

import { useAuth } from '../hooks/Auth';
import sleep from '../utils/sleep';

const Container = styled.div`
    position: relative;
    width: 100%;
    padding: 0.25rem;
    margin: 0 auto;

    video {
        text-align: center;
        width: 100%;
        transform: scaleX(-1);
        background-size: cover;
        border-radius: 0.5rem;
    }
`;

const Controls = styled.div<{ isChangingState: boolean }>`
    position: absolute;
    bottom: 10%;
    display: flex;
    gap: 30px;
    left: 50%;
    transform: translate(-50%);
    align-items: center;
    justify-content: center;
    background-color: #ffffff90;
    padding: 10px;
    border-radius: 8px;
    cursor: ${({ isChangingState }) => (isChangingState ? 'wait' : 'auto')};

    svg {
        width: 20px;
        height: 20px;
        cursor: ${({ isChangingState }) =>
            isChangingState ? 'wait' : 'pointer'};
        pointer-events: ${({ isChangingState }) =>
            isChangingState ? 'none' : 'auto'};

        &:hover {
            color: #00000090;
        }
    }
`;

type WebcamProps = {
    stream: MutableRefObject<MediaStream>;
    isChangingState: boolean;
    setIsChangingState: (isChangingState: boolean) => void;
};

// TODO: test on a device without webcam and blocking browser access to camera and microphone
// TODO: When initialize without webcam, should use noCameraStream.
// TODO: InvalidModificationError on change webcamstate
// TODO: Reduce delay
export default function Webcam({
    stream,
    isChangingState,
    setIsChangingState,
}: WebcamProps) {
    const webcamRef = useRef<HTMLVideoElement>(null);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
    const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
    const [isWebcamAvailable, setIsWebcamAvailable] = useState(true);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);
    const noCameraStream = useRef<MediaStream>();

    console.log(stream);

    const { user } = useAuth();

    useEffect(() => {
        createNotCameraStream().then(
            stream => (noCameraStream.current = stream),
        );

        webcamRef.current.srcObject = stream.current;
        webcamRef.current.play();
    }, []);

    useEffect(() => {
        handleChangeState();
    }, [isWebcamEnabled, isMicrophoneEnabled]);

    const handleChangeState = async () => {
        setIsChangingState(true);

        for (const track of stream.current?.getTracks()) {
            console.log(track['canvas']);
            if (
                (track.kind === 'video' &&
                    !isWebcamEnabled &&
                    !track['canvas']) ||
                (track.kind === 'video' &&
                    isWebcamEnabled &&
                    track['canvas']) ||
                (track.kind === 'audio' && !isMicrophoneEnabled)
            ) {
                track.enabled = false;
                track.stop();

                stream.current.removeTrack(track);
            }
        }

        if (!isWebcamEnabled) {
            const noCameraStream = await createNotCameraStream();
            noCameraStream
                .getVideoTracks()
                .forEach(track => stream.current.addTrack(track));

            if (!isMicrophoneEnabled) {
                setIsChangingState(false);

                return;
            }
        }

        let userStreamAudio: MediaStream;
        try {
            userStreamAudio = await navigator.mediaDevices.getUserMedia({
                audio: isMicrophoneEnabled
                    ? {
                          // deviceId: microphoneDeviceId, TODO
                          echoCancellation: true,
                      }
                    : false,
            });
        } catch (error) {
            setIsMicrophoneAvailable(false);
            setIsMicrophoneEnabled(false)
        }

        let userStreamVideo: MediaStream;
        try {
            userStreamVideo = await navigator.mediaDevices.getUserMedia({
                video: isWebcamEnabled
                    ? {
                          //   deviceId: webcamDeviceId, TODO
                          width: 1280,
                          height: 720,
                      }
                    : false,
            });
        } catch (error) {

            
            setIsWebcamAvailable(false);
            setIsWebcamEnabled(false)
            userStreamVideo = await createNotCameraStream();
        }

        for (const userStreamTrack of [
            ...userStreamAudio.getTracks(),
            ...userStreamVideo.getTracks(),
        ]) {
            const trackKind = userStreamTrack.kind;

            for (const streamTrack of stream.current.getTracks()) {
                if (streamTrack.kind === trackKind) {
                    continue;
                }
            }

            stream.current.addTrack(userStreamTrack);
        }

        setIsChangingState(false);
    };

    const createNotCameraStream = (): Promise<MediaStream> => {
        // TODO: add audio visualization
        return new Promise(resolve => {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#242120';
            ctx.fillRect(0, 0, 1280, 720);

            const profileImage = new Image();

            console.log(`data:image/png;base64,${user.avatar}`);
            profileImage.width = 256;
            profileImage.height = 256;

            profileImage.onload = () => {
                ctx.translate(
                    canvas.width / 2 + profileImage.width / 2,
                    canvas.height / 2 - profileImage.height / 2,
                );

                ctx.scale(-1, 1);

                ctx.drawImage(
                    profileImage,
                    0,
                    0,
                    profileImage.width,
                    profileImage.height,
                );

                ctx.setTransform(1, 0, 0, 1, 0, 0);

                const stream = canvas.captureStream(1);

                resolve(stream);
            };
            profileImage.src = `data:image/png;base64,${user.avatar}`;
        });
    };

    return (
        <Container>
            <video
                ref={webcamRef}
                autoPlay
                playsInline
                muted
                //controls
            />
            <Controls isChangingState={isChangingState}>
                {isMicrophoneEnabled ? (
                    <BsMicFill onClick={() => setIsMicrophoneEnabled(false)} />
                ) : (
                    <BsMicMuteFill
                        onClick={() => {
                            if (isMicrophoneAvailable)
                                return setIsMicrophoneEnabled(true);

                            alert('Microphone is not available'); //TODO: handle
                        }}
                    />
                )}
                {isWebcamEnabled ? (
                    <BsCameraVideoFill
                        onClick={() => setIsWebcamEnabled(false)}
                    />
                ) : (
                    <BsCameraVideoOffFill
                        onClick={() => {
                            if (isWebcamAvailable)
                                return setIsWebcamEnabled(true);

                            alert('Webcam is not available'); //TODO: handle
                        }}
                    />
                )}
            </Controls>
        </Container>
    );
}
