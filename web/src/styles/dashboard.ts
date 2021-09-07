import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

export const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    background-color: #fff;

    h1 {
        font-style: normal;
        font-weight: bold;
        font-size: 3rem;
        line-height: 110%;
        text-align: center;
        color: #2d3748;
        margin: 20px 0px;

        span {
            color: #0bc5ea;
        }
    }

    h2 {
        font-style: normal;
        font-weight: 500;
        font-size: 1rem;
        line-height: 150%;
        text-align: center;
        color: #718096;
        margin: 40px 0px;
    }

    img {
        margin: 50px 0;
        height: 300px;
    }

    > div {
        display: flex;
        gap: 24px;

        button {
            background: #edf2f7;
            border-radius: 26px;
            border: none;
            padding: 10px 24px;
            cursor: pointer;

            :hover {
                background: ${shade(0.1, '#edf2f7')};
            }
        }

        button.login {
            background: #4299e1;
            color: #fafafa;

            :hover {
                background: ${shade(0.1, '#4299e1')};
            }
        }
    }
`;
