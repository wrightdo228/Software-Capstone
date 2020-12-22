import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import UserAvatar from '../general/UserAvatar';
import CodePreview from '../general/CodePreview';
import PostFunctions from './PostFunctions';

const Container = styled.div`
    padding: 57px 68px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #c4c4c4;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    flex-grow: 1;

    .post-functions {
        margin-top: 15px;
    }
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

    .username {
        padding-left: 2px;
    }
`;

const RightSide = styled.div`
    .post-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 30px;
    }

    .post-body {
        white-space: pre-wrap;
    }
`;

const BasicContent = styled.div`
    display: flex;
`;

const Post = ({ post: { title, postBody, _id, codeSandboxId, user } }) => (
    <Container>
        <BasicContent>
            <LeftSide>
                <Link
                    href={`/user?username=${user.username}`}
                    as={`/user/${user.username}`}
                >
                    <a className="post-avatar">
                        <UserAvatar avatarUrl={user.avatar} />
                    </a>
                </Link>
                <Link
                    href={`/user?username=${user.username}`}
                    as={`/user/${user.username}`}
                >
                    <a className="username">{user.username}</a>
                </Link>
            </LeftSide>
            <RightSide>
                <h5 className="post-title">{title}</h5>
                <p className="post-body">{postBody}</p>
            </RightSide>
        </BasicContent>
        {codeSandboxId && <CodePreview sandboxId={codeSandboxId} />}
        <PostFunctions postId={_id} />
    </Container>
);

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;
