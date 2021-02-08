import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../general/UserAvatar';
import { usePageContextValue } from '../../context/PageContext';

const Container = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: #0092e4;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    margin-top: 20px;

    .user-info {
        display: flex;
        align-items: center;
        img {
            margin-right: 5px;
        }
    }

    .buttons {
        button:nth-child(1n + 1) {
            margin-left: 10px;
        }
    }
`;

const UserSearchItem = ({ user }) => {
    const [role, setRole] = useState(user.role);
    const [active, setActive] = useState(user.status === 'active');
    const isAdmin = ['admin', 'super-admin'].includes(user.role);
    const { currentUser } = usePageContextValue();
    const banAllowed =
        !isAdmin ||
        (user.role === 'admin' && currentUser.role === 'super-admin');

    const makeAdmin = async () => {
        const response = await fetch(`/api/user/make-admin/${user._id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setRole('admin');
        }
    };

    // const makeSuperAdmin = async () => {
    //     const response = await fetch(`/api/user/make-super-admin/${user._id}`, {
    //         method: 'PUT',
    //         credentials: 'include',
    //     });

    //     if (response.ok) {
    //         setRole('super-admin');
    //     }
    // };

    const removeAdmin = async () => {
        const response = await fetch(`/api/user/make-user/${user._id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setRole('user');
        }
    };

    const banUser = async () => {
        const response = await fetch(`/api/user/ban/${user._id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setActive(false);
        }
    };

    const unbanUser = async () => {
        const response = await fetch(`/api/user/unban/${user._id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (response.ok) {
            setActive(true);
        }
    };

    return (
        <Container>
            <div className="user-info">
                <UserAvatar type="small" avatarUrl={user.avatar} />
                <div>{user.username}</div>
            </div>
            <div className="buttons">
                {banAllowed &&
                    (active ? (
                        <button type="button" onClick={banUser}>
                            Ban
                        </button>
                    ) : (
                        <button type="button" onClick={unbanUser}>
                            Unban
                        </button>
                    ))}
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
                {/* <button type="button" onClick={makeSuperAdmin}>
                Make Super Admin
            </button> */}
            </div>
        </Container>
    );
};

UserSearchItem.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserSearchItem;
