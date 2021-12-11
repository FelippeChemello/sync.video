import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: stretch;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

export const Content = styled.div`
    width: 100%;
    max-width: 300px;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        text-align: center;
        margin-bottom: 24px;
    }

    input,
    button {
        margin: 1rem 0.5rem 0;
        padding: 0.75rem;
        border-radius: 0.5rem;
        outline: none;
    }

    input {
        border: 2px solid #a1b2cd;
        width: 100%;

        &::placeholder {
            color: #a1b2cd;
        }

        &:focus,
        &:active {
            border-color: #3485ff;
        }
    }

    button {
        border: 2px solid #3485ff;
        background-color: #3485ff;
        width: 100%;
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
`;
