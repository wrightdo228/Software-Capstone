import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import IconButton from '../buttons/IconButton';
import CollectionsModal from '../collections/CollectionsModal';

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const PostFunctions = ({ postId, favorited }) => {
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(favorited);

    const favorite = async () => {
        const response = await fetch('/api/post/favorite', {
            method: 'POST',
            body: JSON.stringify({
                postId,
            }),
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            setIsFavorited(true);
        } else {
            console.log('could not favorite');
        }
    };

    return (
        <Container className="post-functions">
            {collectionsOpen && (
                <CollectionsModal
                    open={collectionsOpen}
                    onClose={() => setCollectionsOpen(false)}
                    postId={postId}
                />
            )}
            <IconButton
                type="collection"
                onClick={() => setCollectionsOpen(true)}
            />
            <IconButton
                selected={isFavorited}
                type="favorite"
                onClick={favorite}
            />
        </Container>
    );
};

PostFunctions.propTypes = {
    postId: PropTypes.string.isRequired,
    favorited: PropTypes.bool.isRequired,
};

export default PostFunctions;
