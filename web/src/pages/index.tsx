import Head from 'next/head';
import Router from 'next/router';
import { NextSeo } from 'next-seo';
import { BsFillPersonFill } from 'react-icons/bs';
import {
    FaYoutube,
    FaTwitch,
    FaDailymotion,
    FaVimeo,
    FaFileVideo,
    FaRegCopyright,
} from 'react-icons/fa';
import {
    MdOutlinePrivateConnectivity,
    MdOutlineFiberNew,
    MdOutlineChat,
} from 'react-icons/md';
import { BsBadgeHd } from 'react-icons/bs';
import { ImFileVideo } from 'react-icons/im';
import { AiOutlineVideoCamera } from 'react-icons/ai';

import {
    Navigation,
    Features,
    Button,
    Header,
    List,
    Footer,
} from '../styles/home';

export default function Home() {
    return (
        <>
            <NextSeo
                title="sync.video"
                description="Sincronize videos locais e online com seus amigos"
            />
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navigation>
                <img src="/assets/logo.png" alt="logo" />

                <div className="desktop">
                    <Button onClick={() => Router.push('signin')}>
                        Acessar
                    </Button>
                    <Button primary onClick={() => Router.push('signup')}>
                        Cadastre-se
                    </Button>
                </div>
                <div className="mobile">
                    <Button border onClick={() => Router.push('signin')}>
                        <BsFillPersonFill />
                    </Button>
                </div>
            </Navigation>
            <Header>
                <div>
                    <h1>Uma nova forma de assistir videos com seus amigos</h1>
                    <h2>Sincroniza a reprodução de videos</h2>
                    <h2>Adiciona video chamada e chat em grupo</h2>

                    <Button primary onClick={() => Router.push('signup')}>
                        Experimente agora
                    </Button>
                </div>

                <div>
                    <p>Plataformas suportadas</p>
                    <div>
                        <FaYoutube />
                        <FaTwitch />
                        <FaVimeo />
                        <FaDailymotion />
                        <FaFileVideo />
                    </div>
                </div>
            </Header>
            <List>
                <h3>Como funciona?</h3>
                <div>
                    <div>
                        <ul>
                            <li key={1}>
                                <div className="number">
                                    <p>1</p>
                                </div>
                                <div className="info">
                                    <h4>Cadastre-se</h4>
                                    <p>
                                        Faça seu cadastro e convide seus amigos
                                        para fazerem o mesmo
                                    </p>
                                </div>
                            </li>
                            <li key={2}>
                                <div className="number">
                                    <p>2</p>
                                </div>
                                <div className="info">
                                    <h4>Crie uma reunião</h4>
                                    <p>
                                        Compartilhe o link da reunião com seus
                                        amigos
                                    </p>
                                </div>
                            </li>
                            <li key={3}>
                                <div className="number">
                                    <p>3</p>
                                </div>
                                <div className="info">
                                    <h4>Escolha um vídeo</h4>
                                    <p>
                                        Insira a URL de um link de um serviço
                                        compatível ou faça upload de um arquivo
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <img src="assets/home.svg" />
                    </div>
                </div>
            </List>
            <Features>
                <h3>Funcionalidades</h3>
                <div>
                    <div>
                        <h4>
                            <AiOutlineVideoCamera /> Video Chamada
                        </h4>
                        <p>
                            Veja a reação de seus amigos em tempo real durante o
                            video
                        </p>
                    </div>
                    <div>
                        <h4>
                            <MdOutlineChat /> Chat
                        </h4>
                        <p>
                            Converse com seus amigos sobre as melhoras cenas do
                            video
                        </p>
                    </div>
                    <div>
                        <h4>
                            <ImFileVideo /> Arquivos locais
                        </h4>
                        <p>
                            Realize o upload de vídeos de seu computador e
                            assista com seus amigos
                        </p>
                    </div>
                    <div>
                        <h4>
                            <BsBadgeHd /> Qualidade máxima
                        </h4>
                        <p>Assista qualquer video com máxima qualidade</p>
                    </div>
                    <div>
                        <h4>
                            <MdOutlinePrivateConnectivity /> Privacidade
                        </h4>
                        <p>
                            Segurança e privacidade garantida através de
                            protocolos de criptografia TLS/SSL
                        </p>
                    </div>
                    <div>
                        <h4>
                            <MdOutlineFiberNew /> Novas plataformas
                        </h4>
                        <p>
                            Em breve suporte a outras plataformas de streaming
                            integradas via extensão e conectadas diretamente na
                            plataforma
                        </p>
                    </div>
                </div>
            </Features>
            <Footer>
                <img src="/assets/logo.png" alt="logo" />
                <p>
                    <FaRegCopyright />
                    sync.video
                </p>
            </Footer>
        </>
    );
}
