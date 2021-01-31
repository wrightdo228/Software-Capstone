import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import UserSearchItem from '../components/admin/UserSearchItem';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
`;

const Admin = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [collections, setCollections] = useState([]);

    const userSearchTimer = useRef(null);
    const collectionSearchTimer = useRef(null);

    useEffect(
        () => () => {
            if (userSearchTimer.current) {
                clearTimeout(userSearchTimer.current);
            }

            if (collectionSearchTimer.current) {
                clearTimeout(collectionSearchTimer.current);
            }
        },
        [],
    );

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

    const handleCollectionSearch = (e) => {
        const newCollectionName = e.target.value;
        setCollectionName(newCollectionName);

        if (collectionSearchTimer.current) {
            clearTimeout(collectionSearchTimer.current);
        }

        const handleSearch = async () => {
            if (newCollectionName) {
                const response = await fetch(
                    `/api/collection/search/${newCollectionName}`,
                    {
                        credentials: 'include',
                    },
                );

                if (response.ok) {
                    const jsonCollections = await response.json();
                    setCollections(jsonCollections);
                }
            } else {
                setCollections([]);
            }
        };

        collectionSearchTimer.current = setTimeout(handleSearch, 300);
    };

    return (
        <Container>
            <input onChange={handleUserSearch} value={username} type="text" />
            <div>
                {users.map((user) => (
                    <UserSearchItem key={user.id} user={user} />
                ))}
            </div>
            <input
                type="text"
                value={collectionName}
                onChange={handleCollectionSearch}
            />
            <div>
                {collections.map((collection) => (
                    <div key={collection._id}>{collection.title}</div>
                ))}
            </div>
        </Container>
    );
};

export default Admin;
