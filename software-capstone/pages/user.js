import PropTypes from 'prop-types';
import { useState } from 'react';
import Timeline from '../components/posts/Timeline';
import PageContextProvider from '../context/PageContext';

const User = ({ user, initialPosts, currentUser }) => {
    const [posts, setPosts] = useState(initialPosts);

    const value = {
        posts,
        setPosts,
        currentUser,
    };

    return (
        <PageContextProvider value={value}>
            <div>
                <Timeline user={user} posts={posts} />
            </div>
        </PageContextProvider>
    );
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    initialPosts: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
};

User.getInitialProps = async ({ query, req }) => {
    const props = {
        success: true,
        user: {},
        currentUser: {},
        initialPosts: [],
    };
    const cookie = req ? { cookie: req.headers.cookie } : undefined;

    const userResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${query.username}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    const feedResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/user-feed/${query.username}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    const currentUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const allPromises = await Promise.all([
        userResponse,
        feedResponse,
        currentUserResponse,
    ]);

    allPromises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.user = await allPromises[0].json();
        props.initialPosts = await allPromises[1].json();
        props.currentUser = await allPromises[2].json();
    }

    return props;
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    initialPosts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default User;
