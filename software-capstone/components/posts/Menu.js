import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { usePageContextValue } from '../../context/PageContext';

const Container = styled.div`
    position: absolute;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #c4c4c4;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    top: 20px;
    right: 0;

    .menu-button {
        white-space: nowrap;
        text-align: left;
        padding: 10px 0;
        background-color: #fff;
        border-radius: 0;
        min-width: 100px;
        color: #000;

        :hover {
            background-color: #fffbfa;
        }
    }

    .delete-button {
        color: #eb4934;
    }
`;

const Menu = ({
    close,
    currentUser,
    user,
    postId,
    onPostPage,
    onCollectionPage,
    collectionId,
    canRemovePosts,
    deleteAllowed,
}) => {
    const menu = useRef(null);
    const router = useRouter();
    const { posts, setPosts } = usePageContextValue();

    const isAdmin = (userToCheck) =>
        ['admin', 'super-admin'].includes(userToCheck.role);

    const banAllowed =
        (!isAdmin(user) && isAdmin(currentUser)) ||
        (user.role === 'admin' && currentUser.role === 'super-admin');
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menu.current && !menu.current.contains(e.target)) {
                close();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [close]);

    const deletePost = async () => {
        const response = await fetch(`/api/post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            if (onPostPage) {
                router.push('/');
            } else {
                const newPosts = posts.filter((post) => post._id !== postId);
                setPosts(newPosts);
                close();
            }
        }
    };

    const removeFromCollection = async () => {
        const response = await fetch(
            `/api/collection/remove-from-collection/${collectionId}/${postId}`,
            {
                method: 'PUT',
                credentials: 'include',
            },
        );

        if (response.ok) {
            const newPosts = posts.filter((post) => post._id !== postId);
            setPosts(newPosts);
            close();
        }
    };
    return (
        <Container ref={menu}>
            {deleteAllowed && (
                <button
                    className="menu-button delete-button"
                    type="button"
                    onClick={deletePost}
                >
                    Delete
                </button>
            )}
            {onCollectionPage && canRemovePosts && (
                <button
                    className="menu-button delete-button"
                    type="button"
                    onClick={removeFromCollection}
                >
                    Remove from collection
                </button>
            )}
            {/* {isAdmin(currentUser) && (
                <button
                    className="menu-button"
                    type="button"
                    onClick={deletePost}
                >
                    Feature Post
                </button>
            )} */}
            {/* {banAllowed && (
                <button
                    className="menu-button"
                    type="button"
                    onClick={banUser}
                >
                    Ban User
                </button>
            )} */}
        </Container>
    );
};

Menu.propTypes = {
    postId: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'admin', 'super-admin']),
    close: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onPostPage: PropTypes.bool,
    collectionId: PropTypes.string,
    onCollectionPage: PropTypes.bool,
    canRemovePosts: PropTypes.bool,
    deleteAllowed: PropTypes.bool,
};

export default Menu;
