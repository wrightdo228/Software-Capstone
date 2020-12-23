import PropTypes from 'prop-types';

const Followers = ({ user }) => (
    <div>
        {user.following.map((follow) => (
            <div>{follow.username}</div>
        ))}
    </div>
);

Followers.propTypes = {
    user: PropTypes.object.isRequired,
};

Followers.getInitialProps = async ({ query, req }) => {
    const props = { success: false, user: {} };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/following/${query.userId}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        props.user = await response.json();
        props.success = true;
    }

    return props;
};

export default Followers;
