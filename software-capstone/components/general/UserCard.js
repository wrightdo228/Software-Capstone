import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserInfoSection from './UserInfoSection';
import UserCardSection from './UserCardSection';
import Icon from '../buttons/Icon';

const Container = styled.div`
    background: #ffffff;
    width: 100%;
    max-width: 283px;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);

    > div {
        border-bottom: 1px solid #c4c4c4;
    }

    > div:last-child {
        border-bottom: none;
    }

    p {
        font-size: 14px;
        font-weight: 700;
    }
`;

const UserCard = ({ openCreatePost, user }) => {
    const [following, setFollowing] = useState(user.following);

    const followRequest = async (method) => {
        const response = await fetch(`/api/user/follow/${user.id}`, {
            method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            setFollowing(!following);
        } else {
            console.log('could not follow');
        }
    };

    return (
        <Container className="user-card">
            <UserInfoSection
                followerCount={user.followerCount}
                followingCount={user.followingCount}
                username={user.username}
                avatarUrl={user.avatar}
            />
            <UserCardSection>
                <Link
                    href={`/favorites?username=${user.username}`}
                    as={`/favorites/${user.username}`}
                >
                    <a>
                        <Icon type="favorite" />
                        <p>Favorites ({user.favoriteCount})</p>
                    </a>
                </Link>
            </UserCardSection>
            <UserCardSection>
                <Link href="#">
                    <a>
                        <Icon type="collection" />
                        <p>Collections ({user.collectionCount})</p>
                    </a>
                </Link>
            </UserCardSection>
            {user.ownAccount ? (
                <UserCardSection onClick={openCreatePost}>
                    <Icon type="new" />
                    <p>New Post</p>
                </UserCardSection>
            ) : (
                <UserCardSection
                    onClick={
                        following
                            ? () => followRequest('DELETE')
                            : () => followRequest('POST')
                    }
                >
                    <Icon type="follow" />
                    <p>{following ? 'Following' : 'Follow'}</p>
                </UserCardSection>
            )}
        </Container>
    );
};

UserCard.propTypes = {
    openCreatePost: PropTypes.func,
    user: PropTypes.object.isRequired,
};

export default UserCard;
