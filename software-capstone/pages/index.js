import Head from 'next/head';
import styled from 'styled-components';
import UserCard from '../components/general/UserCard';
import Post from '../components/general/Post';

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

const Home = () => {
    const logout = async () => {
        await fetch('/api/authentication/logout');
    };

    const post = async () => {
        await fetch('/api/post', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });
    };

    return (
        <div>
            <button type="button" onClick={logout}>
                logout
            </button>
            <button type="button" onClick={post}>
                post
            </button>
            <Head>
                <title>Donneil's Capstone</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <UserCard />
                <Posts>
                    <Post />
                    <Post />
                </Posts>
            </Container>
        </div>
    );
};

export default Home;
