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

const Posts = ({ onCollectionPage, collectionId, canRemovePosts }) => {
    const { posts } = usePageContextValue();

    return (
        <Container>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        canRemovePosts={canRemovePosts}
                        onCollectionPage={onCollectionPage}
                        collectionId={collectionId}
                        key={post._id}
                        post={post}
                    />
                ))
            ) : (
                <NoPosts />
            )}
        </Container>
    );
};

Posts.propTypes = {
    onCollectionPage: PropTypes.bool,
    collectionId: PropTypes.string,
    canRemovePosts: PropTypes.bool,
};

export default Posts;
