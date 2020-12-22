import styled from 'styled-components';
import Router from 'next/router';
import PropTypes from 'prop-types';
import UploadAvatar from '../components/profile/UploadAvatar';

const Profile = ({ user }) => {
    const logout = async () => {
        const response = await fetch('/api/authentication/logout', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            Router.push('/login');
        } else {
            console.log('error loggin out..');
        }
    };

    return (
        <div>
            <button type="button" onClick={logout}>
                logout
            </button>
            <input type="text" />
            <UploadAvatar avatarUrl={user.avatar} />
        </div>
    );
};

Profile.getInitialProps = async ({ req }) => {
    const props = { success: false, user: {} };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        const jsonObject = await response.json();
        props.success = true;
        props.user = jsonObject;
    }

    return props;
};

Profile.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Profile;
