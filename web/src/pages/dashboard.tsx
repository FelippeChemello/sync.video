import { useCallback, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseCookies } from 'nookies';

import api from '../services/api';

import { Main, Container } from '../styles/dashboard';

import TopBar from '../components/loggedTopBar';
import Carousel from '../components/carousel';

export default function Dashboard() {
    const { t } = useTranslation('common');
    const [partyCode, setPartyCode] = useState('');

    const createParty = useCallback(async () => {
        try {
            const {
                data: { party: partyId },
            } = await api.post('/party');

            Router.push(`/party/${partyId}`);
        } catch (err) {
            //TODO
        }
    }, []);

    const accessParty = useCallback(
        event => {
            //TODO
            console.log(partyCode);
        },
        [partyCode],
    );

    return (
        <Container>
            <TopBar />
            <Main>
                <main>
                    <div>
                        <h1>{t('dashboard-title')}</h1>
                        <h2
                            dangerouslySetInnerHTML={{
                                __html: t('dashboard-subtitle'),
                            }}
                        ></h2>
                    </div>
                    <div>
                        <button onClick={createParty}>{t('new-party')}</button>
                        <input
                            placeholder={t('enter-existing-party')}
                            onChange={event => setPartyCode(event.target.value)}
                        ></input>
                        <button onClick={accessParty}>
                            {t('enter-party')}
                        </button>
                    </div>
                </main>
                <aside>
                    <Carousel>
                        <div>
                            <img
                                src="/assets/full-quality.svg"
                                alt="Full quality audio and video"
                            />
                            <div>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: t('dashboard-carousel-quality'),
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <img
                                src="/assets/every-device.svg"
                                alt="Watch in every device"
                            />
                            <div>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: t('dashboard-carousel-device'),
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <img
                                src="/assets/video-conf.svg"
                                alt="Video conference integrated"
                            />
                            <div>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: t(
                                            'dashboard-carousel-videoconference',
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </Carousel>
                </aside>
            </Main>
        </Container>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const { ['sync.video-token']: token } = parseCookies(ctx);

        if (!token) {
            throw new Error('Token not found');
        }

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        await api.get('users');

        return {
            props: {
                ...(await serverSideTranslations(ctx.locale, ['common'])),
            },
        };
    } catch (err) {
        return { redirect: { destination: '/', permanent: false } };
    }
};
