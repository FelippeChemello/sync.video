import {
    useState,
    useEffect,
    ChangeEvent,
    useCallback,
    useMemo,
    forwardRef,
} from 'react';
import styled, { css } from 'styled-components';
import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';
import XhrUpload from '@uppy/xhr-upload';

import api from '../services/api';

import { useToast } from '../hooks/Toast';
import { useAuth } from '../hooks/Auth';
import { parseCookies } from 'nookies';
import Separator from './separator';

const Container = styled.div`
    display: flex;
    width: 100%;
    /* height: 100%; */
    align-items: center;
    flex-direction: column;
    border-radius: 1rem;
    max-width: 800px;
`;

const Header = styled.div`
    height: 50px;
    background-color: #141e2b;
    width: 100%;
    display: flex;
    border-radius: 1rem 1rem 0 0;
    padding: 0.25rem 1rem 0;
    gap: 1rem;

    button {
        background-color: transparent;
        padding: 0 1rem;
        height: 100%;
        height: 100%;
        font-size: 0.9rem;
        text-decoration: none;
        color: white;
        cursor: pointer;
        outline: none;
        border: none;
        position: relative;

        &.active {
            background-color: #283443;
            border-radius: 1rem 1rem 0 0;

            &:before {
                content: '';
                position: absolute;
                height: 16px;
                width: 16px;
                background: none;
                left: -16px;
                bottom: 0;
                border-radius: 0 0 100% 0;
                transform: rotate(0deg);
                box-shadow: 4px 4px 0px 3px #283443;
            }
            &:after {
                content: '';
                position: absolute;
                height: 16px;
                width: 16px;
                background: none;
                right: -16px;
                bottom: 0;
                border-radius: 0 0 0 100%;
                transform: rotate(0deg);
                box-shadow: -4px 4px 0px 3px #283443;
            }
        }
    }
`;

const Content = styled.div`
    width: 100%;
    display: flex;
    overflow-y: auto;
    background-color: #283443;
    border-radius: 0 0 1rem 1rem;
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    height: 60vh;
    overflow-y: auto;
    z-index: 8;

    &::-webkit-scrollbar-track {
        margin: 1rem;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 6px;
    }
`;

const Video = styled.div<{ isClickable: boolean }>`
    display: flex;
    width: 100%;
    max-height: 100px;
    min-height: 100px;
    background-color: #ffffff10;
    padding: 0.5rem;
    border-radius: 1rem;
    gap: 1rem;
    position: relative;

    ${({ isClickable }) =>
        isClickable &&
        css`
            cursor: pointer;

            &:hover {
                background-color: #ffffff20;
            }

            &:hover:before {
                opacity: 1;
            }

            &:before {
                content: 'Clique para reproduzir';
                z-index: 999;
                border-radius: 1rem;
                background-color: #000000;
                color: #fff;
                font-size: 13px;
                padding: 10px;
                box-sizing: border-box;
                position: absolute;
                right: 1%;
                bottom: 10%;
                width: 150px;
                opacity: 0;
                transition: all 0.4s ease;
            }
        `}

    img {
        height: 100%;
        aspect-ratio: 4/3;
        max-width: 120px;
        border-radius: 1rem;
        object-fit: cover;
    }

    div {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #dddfe1;
        text-overflow: ellipsis;

        h3 {
            font-size: 1.2rem;
            margin: 0.3rem 0;
            text-overflow: ellipsis;
            overflow-x: hidden;
        }

        p {
            font-size: 0.9rem;
            margin: 0.3rem 0;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
`;

const UploadLabel = styled.label<{
    filename?: string;
    buttonMessage: string | number;
}>`
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: 2.5rem;
    pointer-events: ${props => (props.filename ? 'none' : 'auto')};

    input {
        display: none;
    }

    span {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 2.5rem;
        padding: 0.5rem 1rem;
        line-height: 1.5;
        color: #555;
        background-color: #fff;
        border: 0.075rem solid #ddd;
        border-radius: 0.5rem;

        &:before {
            position: absolute;
            top: -0.075rem;
            right: -0.075rem;
            bottom: -0.075rem;
            display: block;
            padding: 0.5rem 1rem;
            line-height: 1.5;
            color: #555;
            background-color: #eee;
            border: 0.075rem solid #ddd;
            border-radius: 0 0.25rem 0.25rem 0;
            content: '${props =>
                typeof props.buttonMessage === 'number'
                    ? `Carregando - ${props.buttonMessage}%`
                    : props.buttonMessage}';
        }

        &:after {
            content: '${props =>
                props.filename
                    ? props.filename
                    : 'Realize o upload de um arquivo'}';
        }
    }
`;

type Props = {
    onSelect?: (url: string) => void;
    ref?: React.Ref<HTMLDivElement>;
};

function WatchList({ onSelect }: Props, ref: React.Ref<HTMLDivElement>) {
    const [active, setActive] = useState<'history' | 'files'>('history');
    const [videos, setVideos] = useState<Video[]>([]);
    const [files, setFiles] = useState<VideoFile[]>([]);
    const [inputFileName, setInputFileName] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const { addToast } = useToast();

    const isEnabledClick = useMemo(() => {
        return typeof onSelect === 'function';
    }, [onSelect]);

    useEffect(() => {
        api.get('/party/videos')
            .then(response => {
                setVideos(response.data);
            })
            .catch(() => {
                addToast({
                    title: 'Erro ao carregar histórico de visualização',
                    type: 'error',
                });
            });

        updateFiles();
    }, []);

    const updateFiles = useCallback(() => {
        api.get('/file')
            .then(response => {
                const videos = response.data;

                for (const video of videos) {
                    video.thumbnail = `${process.env.NEXT_PUBLIC_APP_URL}/api/thumbnail?url=${video.url}`;
                }

                setFiles(videos);
            })
            .catch(() =>
                addToast({
                    title: 'Erro ao carregar seus arquivos',
                    type: 'error',
                }),
            );
    }, []);

    const handleInputFile = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files) return;

            if (event.target.files.length > 1) {
                addToast({
                    title: 'Número máximo de arquivos excedido',
                    description: 'Somente é possível enviar um arquivo por vez',
                    type: 'error',
                });
                return;
            }


            if (!event.target.files[0].type.match(/video\/*/)) {
                addToast({
                    title: 'Formato de arquivo inválido',
                    description:
                        'Somente é possível enviar arquivos do tipo MP4',
                    type: 'error',
                });
                return;
            }

            const file = event.target.files[0];

            setInputFileName(file.name);
            setUploadPercentage(0);

            const data = new FormData();
            data.append('file', file);
            data.append('title', file.name);
            data.append(
                'description',
                `Video enviado em ${new Date().toLocaleDateString('pt-br')}`,
            );

            await api.post('/file', data, {
                onUploadProgress: event => {
                    const percentage = Math.round(
                        (event.loaded * 100) / event.total,
                    );

                    setUploadPercentage(percentage);
                },
            });

            updateFiles();
            setUploadPercentage(undefined);
            setInputFileName(undefined);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro ao enviar arquivo',
                description: 'Tente novamente mais tarde',
            });
            console.error(error);
        }
    };

    return (
        <Container ref={ref}>
            <Header>
                <button
                    className={active === 'history' ? 'active' : ''}
                    onClick={() => setActive('history')}
                >
                    Histórico
                </button>
                <button
                    className={active === 'files' ? 'active' : ''}
                    onClick={() => setActive('files')}
                >
                    Meus arquivos
                </button>
            </Header>
            <Content>
                {active === 'history' &&
                    videos.map(video => (
                        <Video
                            key={video.id}
                            isClickable={isEnabledClick}
                            onClick={() =>
                                isEnabledClick && onSelect(video.url)
                            }
                        >
                            <img
                                src={
                                    video.thumbnail ||
                                    '/assets/video-fallback.png'
                                }
                            />
                            <div>
                                <h3>{video.title || video.url}</h3>
                                <p>{video.description}</p>
                            </div>
                        </Video>
                    ))}
                {active === 'files' && (
                    <>
                        <UploadLabel
                            filename={inputFileName}
                            buttonMessage={
                                uploadPercentage
                                    ? uploadPercentage
                                    : 'Escolher arquivo'
                            }
                        >
                            <input type="file" onChange={handleInputFile} />
                            <span></span>
                        </UploadLabel>
                        {files.length >= 1 ? (
                            <>
                                <Separator text="ou" color="#ddd" />
                                {files.map(video => (
                                    <Video
                                        key={video.id}
                                        isClickable={isEnabledClick}
                                        onClick={() =>
                                            isEnabledClick &&
                                            onSelect(video.url)
                                        }
                                    >
                                        <img
                                            src={
                                                video.thumbnail ||
                                                '/assets/video-fallback.png'
                                            }
                                        />
                                        <div>
                                            <h3>{video.title || video.url}</h3>
                                            <p>{video.description}</p>
                                        </div>
                                    </Video>
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </Content>
        </Container>
    );
}

export default forwardRef(WatchList);
