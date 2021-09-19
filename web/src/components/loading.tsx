import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

export default function Loading() {
    return (
        <Container>
            <SyncLoader color="#4299E1" />
        </Container>
    );
}
