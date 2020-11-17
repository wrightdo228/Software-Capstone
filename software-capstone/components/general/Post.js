import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';
import CodePreview from './CodePreview';

const Container = styled.div`
    padding: 57px 68px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #c4c4c4;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    flex-grow: 1;
`;

const LeftSide = styled.div`
    margin-right: 53px;

    a {
        font-size: 12px;
        display: block;
    }

    .post-avatar {
        margin-bottom: 10px;
    }
`;

const RightSide = styled.div`
    .post-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 30px;
    }
`;

const BasicContent = styled.div`
    display: flex;
`;

const Post = ({ post: { title, postBody, _id, sandboxId } }) => {
    const favorite = async () => {
        const response = await fetch('/api/post/favorite', {
            method: 'POST',
            body: JSON.stringify({
                postId: _id,
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
        <Container>
            <BasicContent>
                <LeftSide>
                    <Link href="#">
                        <a className="post-avatar">
                            <UserAvatar />
                        </a>
                    </Link>
                    <Link href="#">
                        <a className="username">RandomUser</a>
                    </Link>
                </LeftSide>
                <RightSide>
                    <h5 className="post-title">{title}</h5>
                    <div
                        className="post-body"
                        dangerouslySetInnerHTML={{ __html: postBody }}
                    />
                </RightSide>
            </BasicContent>
            {sandboxId && <CodePreview sandboxId={sandboxId} />}
            <button type="button" onClick={favorite}>
                fav
            </button>
        </Container>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;
