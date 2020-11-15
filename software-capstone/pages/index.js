import Head from 'next/head';
import styled from 'styled-components';
import { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';
import UserCard from '../components/general/UserCard';
import Post from '../components/general/Post';
import CreatePost from '../components/forms/CreatePost';

const Container = styled.div`
    display: flex;
    align-items: start;
    padding: 75px 108px;

    .user-card {
        margin-right: 70px;
    }
`;

const Posts = styled.div`
    flex-grow: 1;

    > div {
        margin-bottom: 65px;
    }

    > div:last-child {
        margin-bottom: 0;
    }
`;

const Home = ({ user }) => {
    const [createPostOpen, setCreatePostOpen] = useState(false);

    const logout = async () => {
        await fetch('/api/authentication/logout');
    };

    return (
        <div>
            {createPostOpen && (
                <CreatePost onClose={() => setCreatePostOpen(false)} />
            )}
            {/* <button type="button" onClick={logout}>
                logout
            </button> */}
            <Head>
                <title>Donneil's Capstone</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <UserCard
                    user={user}
                    openCreatePost={() => setCreatePostOpen(true)}
                />
                <Posts>
                    <Post />
                    <Post />
                </Posts>
            </Container>
        </div>
    );
};

Home.propTypes = {
    user: PropTypes.object.isRequired,
};

Home.getInitialProps = async ({ req }) => {
    const props = { success: false, user: {} };
    const response = await fetch(`http://localhost:3000/api/user`, {
        credentials: 'include',
        headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    if (response.ok) {
        const jsonObject = await response.json();
        props.success = true;
        props.user = jsonObject;

        return props;
    }

    return {};
};

export default Home;
