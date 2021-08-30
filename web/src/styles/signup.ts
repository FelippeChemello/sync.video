import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: stretch;
`;

const appearFromRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

export const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    flex: 1;
    padding: 1rem;
`;

export const AnimationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    animation: ${appearFromRight} 1s;

    form {
        margin: 80px 0 0;
        min-width: 320px;
        flex: 1;
        max-width: 700px;
        text-align: center;
        display: flex;
        flex-direction: column;

        h1 {
            margin-bottom: 24px;
        }

        a {
            color: #3485ff;
            display: block;
            margin-top: 24px;
            text-decoration: none;
            transition: color 0.2s;

            &:hover {
                color: ${shade(0.2, '#3485FF')};
            }
        }

        input,
        button {
            margin: 1rem 0.5rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
        }

        input {
            border: 2px solid #a1b2cd;

            &::placeholder {
                color: #a1b2cd;
            }
        }

        button {
            border: 2px solid #3485ff;
            background-color: #3485ff;
            color: #fff;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: ${shade(0.2, '#3485ff')};
                border: 2px solid ${shade(0.2, '#3485ff')};
            }

            svg {
                margin-right: 0.5rem;
            }
        }
    }

    hr {
        width: 100%;
        margin: 0 3rem;
    }

    > a {
        background-color: #fff;
        color: #3485ff;
        border: 2px solid #3485ff;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - 1rem);
        margin: 0;
        padding: 0.75rem;
        border-radius: 0.5rem;

        &:hover {
            background-color: #a1b2cd;
            border: 2px solid ${shade(0.2, '#3485ff')};
            color: ${shade(0.2, '#3485ff')};
        }

        svg {
            margin-right: 0.5rem;
        }
    }
`;

export const Background = styled.div`
    min-width: 604px;
    flex: 1;
    background: url('/assets/signup.svg') no-repeat left;
    margin-right: 3rem;

    @media (max-width: 1020px) {
        display: none;
    }
`;
