import styled from 'styled-components';

interface DivProps {
    color?: string;
    distance?: number;
}

const Div = styled.div`
    color: ${(props: DivProps) => (props.color ? props.color : '#000')};
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
    padding: 0 10%;
    margin: ${(props: DivProps) => (props.distance ? props.distance : 0)}px 0;

    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid
            ${(props: DivProps) => (props.color ? props.color : '#000')};
    }

    &:not(:empty)::before {
        margin-right: 0.25em;
    }

    &:not(:empty)::after {
        margin-left: 0.25em;
    }
`;

interface SeparatorProps {
    text: string;
    color?: string;
    distance?: number;
}

export default function Separator({ text, color, distance }: SeparatorProps) {
    return (
        <Div color={color} distance={distance}>
            {text}
        </Div>
    );
}
