import styled from 'styled-components';
import Router from 'next/router';

const Profile = () => {
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
        </div>
    );
};

export default Profile;
