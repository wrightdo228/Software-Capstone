import styled from 'styled-components';
import PropTypes from 'prop-types';
import Post from './Post';
import NoPosts from './NoPosts';

const Container = styled.div`
    flex-grow: 1;
    max-width: 1000px;

    > div {
        margin-bottom: 65px;
    }

    > div:last-child {
        margin-bottom: 0;
    }
`;

const Posts = ({ posts, currentUser }) => (
    <Container>
        {posts.length > 0 ? (
            posts.map((post) => (
                <Post currentUser={currentUser} key={post._id} post={post} />
            ))
        ) : (
            <NoPosts />
        )}
    </Container>
);

Posts.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
};

export default Posts;
