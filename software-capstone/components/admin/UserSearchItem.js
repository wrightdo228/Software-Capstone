import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../general/UserAvatar';

const Container = styled.div`
    padding: 20px;
    display: flex;
`;

const UserSearchItem = ({ user }) => {
    const [role, setRole] = useState(user.role);
    const [active, setActive] = useState(user.status === 'active');

    const makeAdmin = async () => {
        const response = await fetch(`/api/user/make-admin/${user.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setRole('admin');
        }
    };

    const makeSuperAdmin = async () => {
        const response = await fetch(`/api/user/make-super-admin/${user.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setRole('super-admin');
        }
    };

    const removeAdmin = async () => {
        const response = await fetch(`/api/user/make-user/${user.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setRole('user');
        }
    };

    const banUser = async () => {
        const response = await fetch(`/api/user/ban/${user.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setActive(false);
        }
    };

    const unbanUser = async () => {
        const response = await fetch(`/api/user/unban/${user.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setActive(true);
        }
    };

    return (
        <Container>
            <UserAvatar type="small" avatarUrl={user.avatar} />
            <div>{user.username}</div>
            {active ? (
                <button type="button" onClick={banUser}>
                    Ban
                </button>
            ) : (
                <button type="button" onClick={unbanUser}>
                    Unban
                </button>
            )}
            {role === 'admin' && (
                <button type="button" onClick={removeAdmin}>
                    Remove Admin Role
                </button>
            )}
            {role === 'user' && (
                <button type="button" onClick={makeAdmin}>
                    Make Admin
                </button>
            )}
            <button type="button" onClick={makeSuperAdmin}>
                Make Super Admin
            </button>
        </Container>
    );
};

UserSearchItem.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserSearchItem;
