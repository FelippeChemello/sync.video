import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import api from '../services/api';

import { useToast } from '../hooks/Toast';

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
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

const Video = styled.div`
    display: flex;
    width: 100%;
    height: 150px;
    background-color: #ffffff10;
    padding: 0.5rem;
    border-radius: 1rem;
    gap: 1rem;

    img {
        height: 100%;
        aspect-ratio: 4/3;
        max-width: 120px;
        border-radius: 1rem;
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
        }

        p {
            font-size: 0.9rem;
            margin: 0.3rem 0;
        }
    }
`;

export default function WatchList() {
    const [active, setActive] = useState<'history' | 'files'>('history');
    const [videos, setVideos] = useState<Video[]>([]);

    const { addToast } = useToast();

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
    }, []);

    return (
        <Container>
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
                        <Video key={video.id}>
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
                {active === 'files' && <div>Meus arquivos</div>}
            </Content>
        </Container>
    );
}
