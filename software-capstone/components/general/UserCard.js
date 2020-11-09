import styled from 'styled-components';
import Link from 'next/link';
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

const userInfo = {
    followers: 100,
    favorites: 50,
    collections: 5,
    following: 20,
    username: 'NoobCoder77',
};

const UserCard = () => (
    <Container className="user-card">
        <UserInfoSection
            followerCount={userInfo.followers}
            followingCount={userInfo.following}
            username={userInfo.username}
        />
        <UserCardSection>
            <Link href="#">
                <a>
                    <Icon type="favorite" />
                    <p>Favorites ({userInfo.favorites})</p>
                </a>
            </Link>
        </UserCardSection>
        <UserCardSection>
            <Link href="#">
                <a>
                    <Icon type="collection" />
                    <p>Collections ({userInfo.collections})</p>
                </a>
            </Link>
        </UserCardSection>
        <UserCardSection>
            <Icon type="new" />
            <p>New Post</p>
        </UserCardSection>
    </Container>
);

export default UserCard;
