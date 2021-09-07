import Link from 'next/link';
import styled from 'styled-components';

import { useAuth } from '../hooks/Auth';

const Container = styled.div`
    height: 5rem;
    padding: 0.5rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
        div {
            display: none;
        }
    }
`;

export default function LoggedTopBar() {
    const {
        user: { name },
    } = useAuth();

    return (
        <Container>
            <img src="/assets/logo.png" alt="sync.video" />
            <div>
                <button>{name.split(' ')[0]}</button>
                <div>
                    <div className={'dropdown-button'}>
                        <div className={'dropdown-button-icon'}>
                            <i className={'fas fa-bars'} />
                        </div>
                        <div className={'dropdown-button-text'}>
                            <span>Menu</span>
                        </div>
                    </div>
                    <div className={'dropdown-content'}>
                        <div className={'dropdown-content-item'}>
                            <Link href={'/'}>
                                <span>Home</span>
                            </Link>
                        </div>
                        <div className={'dropdown-content-item'}>
                            <Link href={'/about'}>
                                <span>About</span>
                            </Link>
                        </div>
                        <div className={'dropdown-content-item'}>
                            <Link href={'/contact'}>
                                <span>Contact</span>
                            </Link>
                        </div>
                        <div className={'dropdown-content-item'}>
                            <Link href={'/login'}>
                                <span>Log out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
