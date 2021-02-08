import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import UserAvatar from './UserAvatar';

const Container = styled.div`
    padding: 15px 30px;
    display: flex;
    align-items: start;

    img {
        margin-right: 24px;
    }

    .username {
        margin-bottom: 9px;
    }

    a {
        font-size: 14px;
        font-weight: 700;
        display: block;
        margin-bottom: 9px;
    }

    a:last-child {
        margin-bottom: 0;
    }
`;

const UserInfoSection = ({
    username,
    followerCount,
    followingCount,
    avatarUrl,
}) => (
    <Container>
        <UserAvatar avatarUrl={avatarUrl} />
        <div>
            <Link href={`/user/${username}`}>
                <a className="username">{username}</a>
            </Link>
            <Link href={`/following/${username}`}>
                <a id="following">Following {followingCount}</a>
            </Link>
            <Link href={`/followers/${username}`}>
                <a>Followers {followerCount}</a>
            </Link>
        </div>
    </Container>
);

UserInfoSection.propTypes = {
    username: PropTypes.string.isRequired,
    followerCount: PropTypes.number.isRequired,
    followingCount: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string,
};

export default UserInfoSection;
