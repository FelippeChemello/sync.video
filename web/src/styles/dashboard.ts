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
    justify-content: center;
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 4rem;
    gap: 4rem;

    main {
        flex: 1;
        display: flex;
        justify-content: center;
        max-width: 570px;
        text-align: left;
        margin-left: 4rem;

        div {
            h1 {
                font-style: normal;
                font-size: 3rem;
                line-height: 110%;
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
                color: #718096;

                strong {
                    font-weight: bold;
                }
            }
        }
    }

    aside {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
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
            img {
                width: 80%;
            }
        }
    }
`;
