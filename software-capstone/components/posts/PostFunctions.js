import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconButton from '../buttons/IconButton';

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const PostFunctions = ({ postId }) => {
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
            console.log('favorited');
        } else {
            console.log('could not favorite');
        }
    };

    return (
        <Container className="post-functions">
            <IconButton type="favorite" onClick={favorite} />
        </Container>
    );
};

PostFunctions.propTypes = {
    postId: PropTypes.string.isRequired,
};

export default PostFunctions;
