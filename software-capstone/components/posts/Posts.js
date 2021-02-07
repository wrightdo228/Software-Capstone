import styled from 'styled-components';
import PropTypes from 'prop-types';
import Post from './Post';
import NoPosts from './NoPosts';
import { usePageContextValue } from '../../context/PageContext';

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

const Posts = () => {
    const { posts } = usePageContextValue();

    return (
        <Container>
            {posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} post={post} />)
            ) : (
                <NoPosts />
            )}
        </Container>
    );
};

export default Posts;
