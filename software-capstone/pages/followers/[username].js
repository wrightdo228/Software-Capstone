import PropTypes from 'prop-types';
import styled from 'styled-components';
import UserCard from '../../components/general/UserCard';
import PageContextProvider from '../../context/PageContext';

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    max-width: 1600px;
    margin: auto;
    grid-gap: 20px;
    margin-top: 20px;
`;

const Followers = ({ following, currentUser }) => {
    const value = { currentUser };

    return (
        <PageContextProvider value={value}>
            <CardContainer>
                {following.map((follow) => (
                    <UserCard followPage user={follow} />
                ))}
            </CardContainer>
        </PageContextProvider>
    );
};

Followers.propTypes = {
    following: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
};

Followers.getInitialProps = async ({ query, req }) => {
    const props = { success: true, following: [], currentUser: {} };

    const followingResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/followers/${query.username}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([
        followingResponse,
        currentUserResponse,
    ]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.following = await promises[0].json();
        props.currentUser = await promises[1].json();
    }

    return props;
};

export default Followers;
