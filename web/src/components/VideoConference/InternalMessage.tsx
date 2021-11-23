import styled from 'styled-components';

const Container = styled.div<{ isError: boolean }>``;

type InternalMessageProps = {
    message: string;
    isError: boolean;
};

export default function CallMessage({
    message,
    isError,
}: InternalMessageProps) {
    return (
        <Container isError={isError}>
            <p> {message} </p>
        </Container>
    );
}
