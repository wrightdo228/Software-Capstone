import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserAvatar from '../general/UserAvatar';
import { usePageContextValue } from '../../context/PageContext';
import IconButton from '../buttons/IconButton';

const BlurContainer = styled.div`
    width: 100%;
    background-image: ${({ image }) =>
        `url(${image})` ||
        "url('https://hackernoon.com/hn-images/1*Kv-0AsHcK7WRrUDOH8YLIA.png')"};
    filter: blur(1.8px);
    height: 236px;
    background-size: cover;
`;

const Container = styled.div`
    color: #fff;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    .feature-content {
        padding-left: 14px;
        padding-bottom: 20px;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: flex-end;

        img {
            margin-right: 7px;
        }

        p {
            font-size: 12px;
        }

        h5 {
            font-size: 16px;
            margin-bottom: 6px;
            font-weight: 700;
        }
    }

    .username {
        color: #0092e4;
        font-weight: 400;
        font-style: italic;
        font-size: 12px;
    }

    .favorite-content {
        top: 11px;
        right: 14px;
        position: absolute;
        display: flex;

        svg {
            margin-left: 9px;
        }
    }
`;

const FeaturedCard = ({ collection }) => {
    const { currentUser } = usePageContextValue();
    const ownCollection = collection.creator._id === currentUser.id;
    const [favorited, setFavorited] = useState(
        currentUser.postCollections.includes(collection._id),
    );

    const addToCollections = async () => {
        const response = await fetch(
            `/api/collection/add-favorite/${collection._id}`,
            {
                method: 'PUT',
                credentials: 'include',
            },
        );

        if (response.ok) {
            setFavorited(true);
        }
    };

    const removeFromCollections = async () => {
        const response = await fetch(
            `/api/collection/remove-favorite/${collection._id}`,
            {
                method: 'PUT',
                credentials: 'include',
            },
        );

        if (response.ok) {
            setFavorited(false);
        }
    };

    return (
        <Container>
            <Link href={`/collection/${collection._id}`}>
                <BlurContainer image={collection.image} />
            </Link>
            <div className="feature-content">
                <UserAvatar
                    avatarUrl={collection.creator.avatar}
                    type="small"
                />
                <div>
                    <Link href={`/collection/${collection._id}`}>
                        <h5>{collection.title}</h5>
                    </Link>
                    <p>
                        by{' '}
                        <Link href={`/user/${collection.creator.username}`}>
                            <a className="username">
                                {collection.creator.username}
                            </a>
                        </Link>
                    </p>
                </div>
            </div>
            {!ownCollection && (
                <div className="favorite-content">
                    <IconButton
                        onClick={
                            favorited ? removeFromCollections : addToCollections
                        }
                        selected={favorited}
                        type="favorite"
                    />
                </div>
            )}
        </Container>
    );
};

FeaturedCard.propTypes = {
    collection: PropTypes.object,
};

export default FeaturedCard;
