import styled from 'styled-components';
import { shade } from 'polished';

export const Navigation = styled.nav`
    padding: 2rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .mobile {
        display: none;
    }

    .desktop {
        display: flex;
        gap: 1rem;
    }

    @media (max-width: 768px) {
        .mobile {
            display: flex;
        }

        .desktop {
            display: none;
        }
    }
`;

export const Button = styled.button<{ primary?: boolean; border?: boolean }>`
    background: ${props => (props.primary ? '#4299e1' : 'transparent')};
    border-radius: 32px;
    border: ${props => (props.border ? '2px solid #4299e1' : 'none')};
    height: 3.5rem;
    font-size: 1.1rem;
    padding: 10px 24px;
    cursor: pointer;
    color: ${props => (props.primary ? '#fafafa' : '#000')};

    :hover {
        background: ${props =>
            props.primary ? shade(0.1, '#4299e1') : shade(0.1, '#fff')};
    }

    svg {
        color: ${props => (props.primary ? '#fafafa' : '#4299e1')};
        width: 100%;
        height: 100%;
        padding: 0.2rem;
    }
`;

export const Header = styled.header`
    min-height: calc(100vh - 30rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 5rem;

    div {
        display: flex;
        flex-direction: column;
        max-width: 48rem;
        min-width: 256px;

        h1 {
            font-size: 2.25rem;
            line-height: 2.5rem;
            text-align: center;
            margin-bottom: 1rem;
            color: rgba(31, 41, 55);
        }

        h2 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            text-align: center;
            color: rgba(107, 114, 128);
            margin-bottom: 0;

            & + h2 {
                margin-top: 0;
            }

            & + button {
                margin-top: 2rem;
            }
        }

        p {
            text-align: center;
            font-family: NS, 'Courier New', Courier, monospace;
        }

        > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            svg {
                height: 3rem;
                width: 3rem;
                color: #3c4758;
            }
        }

        button {
            align-self: center;
        }
    }

    @media (min-width: 768px) {
        div {
            min-width: 512px;

            > div {
                svg {
                    height: 5rem;
                    width: 5rem;
                }
            }
        }

        h1 {
            font-size: 3rem !important;
            line-height: 1 !important;
        }

        h2 {
            font-size: 1.875rem !important;
            line-height: 2.25rem !important;
        }
    }

    @media (min-width: 1024px) {
        div {
            min-width: 768px;

            > div {
                svg {
                    height: 5.7rem;
                    width: 5.7rem;
                }
            }
        }

        h1 {
            font-size: 6rem !important;
            line-height: 1 !important;
        }
    }
`;

export const List = styled.section`
    background-image: linear-gradient(to bottom, #f9fafb, #fff);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    padding-top: 3rem;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;

    h3 {
        font-size: 2rem;
        line-height: 1;
    }

    div {
        max-width: 48rem;
        min-width: 300px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-around;

        div {
            width: calc(50% - 1rem);

            ul {
                display: flex;
                flex-direction: column;
                padding: 0;
                margin-top: 3rem;
                margin-bottom: 3rem;

                li {
                    /* width: 100%; */
                    display: flex;
                    flex-direction: row;

                    div.number {
                        max-width: 48px;
                        min-width: 48px;
                        max-height: 48px;
                        min-height: 48px;
                        background-color: rgba(239, 246, 255);
                        border-radius: 50%;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        color: #3d87fc;

                        p {
                            font-family: NS, 'Courier New', Courier, monospace;
                            font-size: 1.5rem;
                            line-height: 2rem;
                            margin: auto;
                        }
                    }

                    div.info {
                        display: flex;
                        flex-direction: column;
                        text-align: left;
                        align-items: flex-start;
                        padding: 0 1rem;

                        h4 {
                            font-size: 1.25rem;
                            line-height: 1.75rem;
                            margin: 0;
                            margin-top: 0.75rem;
                        }

                        p {
                            margin-top: 0;
                            color: rgba(107, 114, 128);
                            line-height: 1.2rem;
                        }
                    }

                    @media (min-width: 430px) {
                        div.number {
                            display: flex !important;
                        }
                    }
                }
            }
        }
    }

    @media (min-width: 1024px) {
        h3 {
            font-size: 3.5rem;
            line-height: 1;
        }
    }
`;

export const Features = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    margin-bottom: 5rem;

    h3 {
        font-size: 2rem;
        line-height: 1;
    }

    > div {
        max-width: 70rem;
        min-width: 300px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-around;

        > div {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            width: 100%;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 -2px 14px -2px rgba(0, 0, 0, 0.05);
            border-radius: 0.5rem;
            flex: 1 0 auto;

            h4 {
                font-size: 1.25rem;
                line-height: 1.75rem;
                margin: 0;
                margin-top: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;

                svg {
                    color: #3d87fc;
                }
            }

            p {
                color: rgba(107, 114, 128);
            }
        }
    }

    @media (min-width: 768px) {
        > div {
            > div {
                width: calc(50% - 1rem);
            }
        }
    }

    @media (min-width: 1024px) {
        > div {
            > div {
                width: calc(33% - 1rem);
            }
        }

        h3 {
            font-size: 3.5rem;
            line-height: 1;
        }
    }
`;

export const Footer = styled.footer`
    background-color: #f9fafb;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    img {
        height: 3rem;
    }

    p {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        color: rgba(107, 114, 128);
    }
`;
