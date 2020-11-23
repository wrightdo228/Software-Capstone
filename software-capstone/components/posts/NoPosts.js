import styled from 'styled-components';

const Container = styled.div`
    padding: 57px 68px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #c4c4c4;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    flex-grow: 1;

    p {
        font-weight: 700;
        text-align: center;
    }
`;

const NoPosts = () => (
    <Container>
        <p>No Posts Available</p>
    </Container>
);

export default NoPosts;
