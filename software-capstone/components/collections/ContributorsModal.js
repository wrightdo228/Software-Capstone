import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../general/Modal';
import UserAvatar from '../general/UserAvatar';

const UserItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #c4c4c4;
    justify-content: space-between;
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;

    .user-info {
        display: flex;
        align-items: center;

        img {
            margin-right: 5px;
        }
    }
`;

const UserContainer = styled.div`
    max-height: 300px;
    overflow: auto;
    margin-top: 20px;

    h3 {
        text-align: center;
    }
`;

const ContributorsModal = ({ collectionId, open, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState();
    const [contributors, setContributors] = useState();
    const [users, setUsers] = useState([]);
    const userSearchTimer = useRef(null);

    useEffect(() => {
        const getCurrentContributors = async () => {
            const response = await fetch(
                `/api/collection/contributors/${collectionId}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );

            if (response.ok) {
                const jsonResponse = await response.json();
                setContributors(jsonResponse);
            }

            setLoading(false);
        };

        getCurrentContributors();
    }, [collectionId]);

    const handleUserSearch = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);

        if (userSearchTimer.current) {
            clearTimeout(userSearchTimer.current);
        }

        const handleSearch = async () => {
            if (newUsername) {
                const response = await fetch(
                    `/api/user/search/${newUsername}`,
                    { credentials: 'include' },
                );

                if (response.ok) {
                    const jsonUsers = await response.json();
                    setUsers(jsonUsers);
                }
            } else {
                setUsers([]);
            }
        };

        userSearchTimer.current = setTimeout(handleSearch, 300);
    };

    const addContributor = async (user) => {
        const response = await fetch(
            `/api/collection/add-contributor/${collectionId}/${user._id}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
            },
        );

        if (response.ok) {
            const newContributors = [
                ...contributors,
                { _id: user._id, avatar: user.avatar, username: user.username },
            ];

            setContributors(newContributors);
        }
    };

    const removeContributor = async (user) => {
        const response = await fetch(
            `/api/collection/remove-contributor/${collectionId}/${user._id}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
            },
        );

        if (response.ok) {
            const newContributors = contributors.filter(
                (contributor) => contributor._id !== user._id,
            );

            setContributors(newContributors);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <label htmlFor="user-search-input">
                        User Search:
                        <input
                            id="user-search-input"
                            type="text"
                            value={username}
                            onChange={handleUserSearch}
                        />
                    </label>
                    <UserContainer>
                        <h3>Current Contributors</h3>
                        {contributors.map((contributor) => (
                            <UserItem key={contributor._id}>
                                <div className="user-info">
                                    <UserAvatar
                                        type="small"
                                        avatarUrl={contributor.avatar}
                                    />
                                    <p className="username">
                                        {contributor.username}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeContributor(contributor)
                                    }
                                >
                                    Remove Contributor
                                </button>
                            </UserItem>
                        ))}
                    </UserContainer>
                    <UserContainer>
                        <h3>Users</h3>
                        {users.map((user) => (
                            <UserItem key={user._id}>
                                <div className="user-info">
                                    <UserAvatar
                                        type="small"
                                        avatarUrl={user.avatar}
                                    />
                                    <p className="username">{user.username}</p>
                                </div>
                                {contributors.filter(
                                    (contributor) =>
                                        contributor._id === user._id,
                                ).length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => removeContributor(user)}
                                    >
                                        Remove Contributor
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addContributor(user)}
                                        type="button"
                                    >
                                        Make Contributor
                                    </button>
                                )}
                            </UserItem>
                        ))}
                    </UserContainer>
                </>
            )}
        </Modal>
    );
};

ContributorsModal.propTypes = {
    collectionId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ContributorsModal;
