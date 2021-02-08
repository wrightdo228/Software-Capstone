import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Posts from '../../components/posts/Posts';
import ContributorsModal from '../../components/collections/ContributorsModal';

const { default: PageContextProvider } = require('../../context/PageContext');

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 75px auto;
    max-width: 1000px;

    #button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    #delete-button {
        background-color: #f55742;
    }

    #manage-contributors {
        margin-right: 5px;
    }

    h1 {
        margin-bottom: 10px;
    }

    p {
        margin-bottom: 10px;
        white-space: pre;
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-top: 20px;
`;

const Collection = ({ collection, currentUser, success }) => {
    const router = useRouter();
    const [openContributorsModal, setOpenContributorsModal] = useState(false);
    const [featured, setFeatured] = useState(collection.featured);
    const [posts, setPosts] = useState(collection.posts);
    const isCreator = currentUser.id === collection.creator._id;
    const isContributor = collection.contributors.includes(currentUser.id);
    const canRemovePosts = isContributor || isCreator;
    const isAdmin = ['admin', 'super-admin'].includes(currentUser.role);

    const value = {
        posts,
        setPosts,
        currentUser,
    };

    const featureCollection = async () => {
        const response = await fetch(
            `/api/collection/feature/${collection._id}`,
            {
                method: 'PUT',
                credentials: 'include',
            },
        );

        if (response.ok) {
            setFeatured(true);
        }
    };

    const unfeatureCollection = async () => {
        const response = await fetch(
            `/api/collection/unfeature/${collection._id}`,
            {
                method: 'PUT',
                credentials: 'include',
            },
        );

        if (response.ok) {
            setFeatured(false);
        }
    };

    const deleteCollection = async () => {
        const response = await fetch(`/api/collection/${collection._id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            router.push('/');
        }
    };

    return (
        <PageContextProvider value={value}>
            {openContributorsModal && (
                <ContributorsModal
                    open={openContributorsModal}
                    onClose={() => setOpenContributorsModal(false)}
                    collectionId={collection._id}
                />
            )}
            {success ? (
                <Container>
                    {(isCreator || isAdmin) && (
                        <div id="button-container">
                            <span>
                                {isCreator && (
                                    <button
                                        id="manage-contributors"
                                        type="button"
                                        onClick={() =>
                                            setOpenContributorsModal(
                                                !openContributorsModal,
                                            )
                                        }
                                    >
                                        Manage Contributors
                                    </button>
                                )}
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={
                                            featured
                                                ? unfeatureCollection
                                                : featureCollection
                                        }
                                    >
                                        {featured
                                            ? 'Unfeature Collection'
                                            : 'Feature Collection'}
                                    </button>
                                )}
                            </span>
                            <button
                                id="delete-button"
                                type="button"
                                onClick={deleteCollection}
                            >
                                delete
                            </button>
                        </div>
                    )}
                    <h1>{collection.title}</h1>
                    <p>{collection.description}</p>
                    <Posts
                        canRemovePosts={canRemovePosts}
                        onCollectionPage
                        collectionId={collection._id}
                    />
                </Container>
            ) : (
                <Title>Can not access page</Title>
            )}
        </PageContextProvider>
    );
};

Collection.propTypes = {
    collection: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    success: PropTypes.bool.isRequired,
};

Collection.getInitialProps = async ({ query, req }) => {
    const props = {
        success: true,
        collection: {},
        currentUser: {},
    };

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const collectionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/collection/specific-collection/${query.collectionId}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([
        currentUserResponse,
        collectionResponse,
    ]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.currentUser = await promises[0].json();
        props.collection = await promises[1].json();
    }

    return props;
};

export default Collection;
