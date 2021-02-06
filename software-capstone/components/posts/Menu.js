import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';

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
        text-align: left;
        padding: 10px 0;
        background-color: #fff;
        border-radius: 0;
        min-width: 100px;
        color: #000;
    }

    .delete-button {
        color: #eb4934;
    }
`;

const Menu = ({ close, currentUser, user, postId }) => {
    const menu = useRef(null);
    const isAdmin = (userToCheck) =>
        ['admin', 'super-admin'].includes(userToCheck.role);

    const deleteAllowed = currentUser.id === user.id || isAdmin(currentUser);
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
            {isAdmin && (
                <button
                    className="menu-button"
                    type="button"
                    onClick={deletePost}
                >
                    Feature Post
                </button>
            )}
            {banAllowed && (
                <button
                    className="menu-button"
                    type="button"
                    onClick={deletePost}
                >
                    Ban User
                </button>
            )}
        </Container>
    );
};

Menu.propTypes = {
    isOwnPost: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'admin', 'super-admin']),
    close: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default Menu;
