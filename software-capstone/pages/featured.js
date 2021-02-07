import styled from 'styled-components';
import PropTypes from 'prop-types';
import FeaturedCard from '../components/featured/FeaturedCard';
import PageContextProvider from '../context/PageContext';

const Container = styled.div`
    max-width: 1600px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 56px;
    margin: 0 auto;
    margin-top: 50px;
`;

const Title = styled.h1`
    text-align: center;
    margin: 20px 0;
`;

const Featured = ({ currentUser, collections }) => {
    const value = {
        currentUser,
        collections,
    };

    return (
        <PageContextProvider value={value}>
            <Title>Featured Collections</Title>
            <Container>
                {collections.map((collection) => (
                    <FeaturedCard
                        collection={collection}
                        key={collection._id}
                    />
                ))}
            </Container>
        </PageContextProvider>
    );
};

Featured.propTypes = {
    currentUser: PropTypes.object.isRequired,
    collections: PropTypes.array,
};

Featured.getInitialProps = async ({ req }) => {
    const props = { collections: [], currentUser: {}, success: true };

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const collectionResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/collection/featured-collections`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([
        currentUserResponse,
        collectionResponse,
    ]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.currentUser = await promises[0].json();
        props.collections = await promises[1].json();
    }

    return props;
};

export default Featured;
