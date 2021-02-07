import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Timeline from '../components/posts/Timeline';
import PageContextProvider from '../context/PageContext';

const Home = ({ user, initialPosts }) => {
    const [posts, setPosts] = useState(initialPosts);

    const value = {
        posts,
        setPosts,
        currentUser: user,
    };

    return (
        <PageContextProvider value={value}>
            <div>
                <Head>
                    <title>Donneil's Capstone</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Timeline user={user} />
            </div>
        </PageContextProvider>
    );
};

Home.propTypes = {
    user: PropTypes.object.isRequired,
    initialPosts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Home.getInitialProps = async ({ req }) => {
    const props = { success: false, user: {}, initialPosts: [] };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const feedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/main-feed`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        const jsonObject = await response.json();
        props.success = true;
        props.user = jsonObject;
        props.initialPosts = await feedResponse.json();
    }

    return props;
};

export default Home;
