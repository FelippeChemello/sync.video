import Head from 'next/head';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import AppProvider from '../hooks';

import '../styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <link
                    rel="preload"
                    href="assets/Product Sans Regular.ttf"
                    as="font"
                    crossOrigin=""
                />
                <title>Sync video player with friends</title>
                <meta
                    name="description"
                    content="Sync video player with friends"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppProvider>
                <Component {...pageProps} />
            </AppProvider>
        </>
    );
};

export default appWithTranslation(App);
