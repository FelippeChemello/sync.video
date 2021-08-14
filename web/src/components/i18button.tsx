import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    padding-right: 1rem;

    li {
        cursor: pointer;
    }
`;

export default function LocaleSwitcher() {
    const [display, setDisplay] = useState<'block' | 'none'>('none');

    const router = useRouter();
    const { locales, locale: activeLocale } = router;
    const otherLocales = locales.filter(locale => locale !== activeLocale);

    return (
        <Container
            onMouseEnter={() => setDisplay('block')}
            onMouseLeave={() => setDisplay('none')}
        >
            <ul style={{ listStyle: 'none' }}>
                <li>
                    <img
                        src={`/locales/${activeLocale}/flag.png`}
                        width="32px"
                    ></img>
                </li>
                {otherLocales.map(locale => {
                    const { pathname, query, asPath } = router;
                    return (
                        <li key={locale} style={{ display }}>
                            <Link
                                href={{ pathname, query }}
                                as={asPath}
                                locale={locale}
                            >
                                <img
                                    src={`/locales/${locale}/flag.png`}
                                    width="32px"
                                ></img>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Container>
    );
}
