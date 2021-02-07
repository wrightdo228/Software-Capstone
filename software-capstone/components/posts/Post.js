import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';
import UserAvatar from '../general/UserAvatar';
import CodePreview from '../general/CodePreview';
import PostFunctions from './PostFunctions';
import IconButton from '../buttons/IconButton';
import Menu from './Menu';
import { usePageContextValue } from '../../context/PageContext';

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
    width: 100%;

    .post-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 30px;
    }

    .post-body {
        white-space: pre-wrap;
    }

    #title-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    #menu-container {
        position: relative;
    }

    .menu-enter {
        opacity: 0;
        transform: scale(0.95);
    }

    .menu-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 200ms ease-in, transform 200ms ease-in;
    }

    .menu-exit {
        opacity: 1;
        transform: scale(1);
    }

    .menu-exit-active {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 200ms ease-in, transform 200ms ease-in;
    }
`;

const BasicContent = styled.div`
    display: flex;
`;

const Post = ({
    post: { title, postBody, _id, codeSandboxId, user, favorited },
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser } = usePageContextValue();
    const isAdmin = (userToCheck) =>
        ['admin', 'super-admin'].includes(userToCheck.role);

    const deleteAllowed = currentUser.id === user.id || isAdmin(currentUser);
    const banAllowed =
        (!isAdmin(user) && isAdmin(currentUser)) ||
        (user.role === 'admin' && currentUser.role === 'super-admin');

    return (
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
                    <div id="title-container">
                        <h5 className="post-title">{title}</h5>
                        {(deleteAllowed || banAllowed) && (
                            <span id="menu-container">
                                <IconButton
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    type="menu"
                                />
                                <CSSTransition
                                    in={isMenuOpen}
                                    timeout={200}
                                    classNames="menu"
                                    unmountOnExit
                                >
                                    <Menu
                                        postId={_id}
                                        deleteAllowed={deleteAllowed}
                                        banAllowed={banAllowed}
                                        user={user}
                                        currentUser={currentUser}
                                        id={_id}
                                        close={() => setIsMenuOpen(false)}
                                    />
                                </CSSTransition>
                            </span>
                        )}
                    </div>
                    <p className="post-body">{postBody}</p>
                </RightSide>
            </BasicContent>
            {codeSandboxId && <CodePreview sandboxId={codeSandboxId} />}
            <PostFunctions favorited={favorited} postId={_id} />
        </Container>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;
