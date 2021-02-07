import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Posts from '../components/posts/Posts';
import PageContextProvider from '../context/PageContext';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 75px auto;
    max-width: 1000px;
`;

const Favorites = ({ initialPosts, currentUser }) => {
    const [posts, setPosts] = useState(initialPosts);

    const value = {
        posts,
        setPosts,
        currentUser,
    };

    return (
        <PageContextProvider value={value}>
            <Container>
                <Posts />
            </Container>
        </PageContextProvider>
    );
};

Favorites.propTypes = {
    initialPosts: PropTypes.arrayOf(PropTypes.object),
    currentUser: PropTypes.object.isRequired,
};

Favorites.getInitialProps = async ({ req, query }) => {
    const props = { success: true, initialPosts: [], currentUser: {} };
    const { username } = query;
    const cookie = req ? { cookie: req.headers.cookie } : undefined;

    const postsResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/favorites/${username}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([postsResponse, currentUserResponse]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (postsResponse.ok) {
        props.success = true;
        props.initialPosts = await promises[0].json();
        props.currentUser = await promises[1].json();
    }

    return props;
};

export default Favorites;
