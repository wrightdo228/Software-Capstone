import styled from 'styled-components';
import PropTypes from 'prop-types';
import Posts from '../components/posts/Posts';

const Container = styled.div``;

const Favorites = ({ posts }) => (
    <Container>
        <Posts posts={posts} />
    </Container>
);

Favorites.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
};

Favorites.getInitialProps = async ({ req, query }) => {
    const props = { success: false, posts: [] };
    const { username } = query;
    const cookie = req ? { cookie: req.headers.cookie } : undefined;

    const postsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/favorites/${username}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    if (postsResponse.ok) {
        props.success = true;
        props.posts = await postsResponse.json();
    }

    return props;
};

export default Favorites;
