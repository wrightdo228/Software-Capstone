import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserSearchItem from '../components/admin/UserSearchItem';
import PageContextProvider from '../context/PageContext';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
`;

const Admin = ({ currentUser }) => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

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

    return (
        <PageContextProvider value={{ currentUser }}>
            <Container>
                <label htmlFor="user-search">
                    User Search:
                    <input
                        id="user-search"
                        onChange={handleUserSearch}
                        value={username}
                        type="text"
                    />
                </label>
                <div>
                    {users.map((user) => (
                        <UserSearchItem key={user._id} user={user} />
                    ))}
                </div>
            </Container>
        </PageContextProvider>
    );
};

Admin.propTypes = {
    currentUser: PropTypes.object.isRequired,
};

Admin.getInitialProps = async ({ req }) => {
    const props = { success: false, currentUser: {} };

    const currentUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (currentUserResponse.ok) {
        props.success = true;
        props.currentUser = await currentUserResponse.json();
    }

    return props;
};

export default Admin;
