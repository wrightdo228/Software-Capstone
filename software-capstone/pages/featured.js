import styled from 'styled-components';
import FeaturedCard from '../components/featured/FeaturedCard';

const Container = styled.div`
    max-width: 1600px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 56px;
    margin: 0 auto;
    margin-top: 150px;
`;

const Featured = () => (
    <Container>
        <FeaturedCard />
    </Container>
);

export default Featured;
