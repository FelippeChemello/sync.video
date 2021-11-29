import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

export const Main = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 4rem;
    gap: 4rem;

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 570px;
        text-align: left;
        margin-left: 4rem;
        gap: 1rem;

        div {
            h1 {
                font-style: normal;
                font-size: 3rem;
                line-height: 110%;
                color: #2d3748;
                margin: 20px 0px;
            }

            h2 {
                font-style: normal;
                font-weight: 500;
                font-size: 1rem;
                line-height: 150%;
                color: #718096;

                strong {
                    font-weight: bold;
                }
            }

            button {
                outline: none;
                background-color: #1a73e8;
                color: #fff;
                border: 1px solid #1a73e8;
                padding: 1rem 0.7rem;
                border-radius: 0.3rem;
                font-size: 1.1rem;
                margin-right: 1rem;
                cursor: pointer;
            }

            input {
                outline: none;
                background-color: #fff;
                color: #000;
                border: 1px solid #1a73e8;
                padding: 1rem 0.7rem;
                border-radius: 0.3rem;
                font-size: 1.1rem;
                margin-right: 0.5rem;
            }

            input::placeholder {
                color: ${shade(0.2, '#1a73e8')};
                opacity: 0.5;
            }

            input + button {
                outline: none;
                background-color: transparent;
                color: #1a73e8;
                border: none;
                font-size: 1.1rem;
                cursor: pointer;
            }
        }
    }

    aside {
        flex: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: end;
    }

    @media (max-width: 1024px) {
        flex-direction: column;

        main {
            margin-left: 0rem !important;

            h1 {
                font-size: 2rem !important;
            }
        }

        aside {
            div {
                img {
                    width: 80%;
                }
            }
        }
    }

    @media (max-width: 600px) {
        main {
            h1,
            h2 {
                text-align: center;
            }
        }

        aside {
            display: none;
        }
    }
`;
