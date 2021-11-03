import styled, { css } from 'styled-components';

const Container = styled.div<{ backgroundImage?: string; isActive: boolean }>`
    width: 64px;
    height: 64px;
    ${props =>
        props.isActive
            ? css`
                  border: 3px solid #0066ff;
              `
            : css`
                  border: 2px solid #ddd;
              `};
    border-radius: 0.5rem;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-image: ${props =>
        props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
    background-size: cover;
`;

type Props = WebcamBackgroundTypesDisplay & {
    onClick: (selected: WebcamBackgroundTypesDisplay) => void;
    isActive: boolean;
};

export default function RadioButton({
    label,
    type,
    image: Image,
    isActive,
    onClick,
}: Props) {
    if (type === 'image')
        return (
            <Container
                backgroundImage={Image}
                isActive={isActive}
                onClick={() => onClick({ label, type, image: Image })}
            />
        );

    return (
        <Container
            isActive={isActive}
            onClick={() => onClick({ label, type, image: Image })}
        >
            <Image size={32} />
        </Container>
    );
}
