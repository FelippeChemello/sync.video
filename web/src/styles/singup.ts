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
        margin: 80px 0;
        min-width: 320px;
        flex: 1;
        max-width: 700px;
        text-align: center;
        h1 {
            margin-bottom: 24px;
        }
        a {
            color: #f4ede8;
            display: block;
            margin-top: 24px;
            text-decoration: none;
            transition: color 0.2s;
            &:hover {
                color: ${shade(0.2, '#f4ede8')};
            }
        }
    }
    /* > indica apenas as tags 'a' que vierem diretamente após a div  */
    > a {
        color: #ff9000;
        display: block;
        margin-top: 24px;
        text-decoration: none;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            color: ${shade(0.2, '#ff9000')};
        }
        svg {
            margin-right: 16px;
        }
    }
`;

export const Background = styled.div`
    min-width: 604px;
    flex: 1;
    background: url('/assets/signin.svg') no-repeat left;
    margin-right: 3rem;

    @media (max-width: 1020px) {
        display: none;
    }
`;
