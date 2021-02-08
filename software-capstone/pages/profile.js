import styled from 'styled-components';
import Router from 'next/router';
import PropTypes from 'prop-types';
import UploadAvatar from '../components/profile/UploadAvatar';

const Container = styled.div`
    padding: 20px;
    background-color: #fff;
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 40px;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    box-shadow: 10px 10px 11px rgb(201 201 201 / 25%);
`;

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
        <Container>
            <button type="button" onClick={logout}>
                logout
            </button>
            <UploadAvatar avatarUrl={user.avatar} />
        </Container>
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
