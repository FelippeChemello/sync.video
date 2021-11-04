import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
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
