import PropTypes from 'prop-types';
import Timeline from '../components/posts/Timeline';

const User = ({ user, posts }) => (
    <div>
        <Timeline user={user} posts={posts} />
    </div>
);

User.propTypes = {};

User.getInitialProps = async ({ query, req }) => {
    const props = { success: true, user: {}, posts: [] };
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

    const allPromises = await Promise.all([userResponse, feedResponse]);

    allPromises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.user = await allPromises[0].json();
        props.posts = await allPromises[1].json();
    }

    return props;
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default User;
