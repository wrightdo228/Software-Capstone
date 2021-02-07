import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CreateCollection from '../../components/forms/CreateCollection';
import FeaturedCard from '../../components/featured/FeaturedCard';
import PageContextProvider from '../../context/PageContext';

const CollectionContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 56px;
    margin-top: 30px;
`;

const PageLayout = styled.div`
    max-width: 1600px;
    margin: 0 auto;

    #button-container {
        margin-top: 30px;
    }
`;

const Collections = ({ user, currentUser }) => {
    const [formOpen, setFormOpen] = useState();
    const [collections, setCollections] = useState(user.postCollections);

    const value = {
        currentUser,
        collections,
        setCollections,
    };

    return (
        <PageContextProvider value={value}>
            <PageLayout>
                {user._id === currentUser.id && (
                    <div id="button-container">
                        {formOpen && (
                            <CreateCollection
                                onClose={() => setFormOpen(false)}
                                open={formOpen}
                            />
                        )}
                        <button type="button" onClick={() => setFormOpen(true)}>
                            Create
                        </button>
                    </div>
                )}
                <CollectionContainer>
                    {collections.map((collection) => (
                        <FeaturedCard
                            key={collection._id}
                            collection={collection}
                        />
                    ))}
                </CollectionContainer>
            </PageLayout>
        </PageContextProvider>
    );
};

Collections.propTypes = {
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};

Collections.getInitialProps = async ({ query, req }) => {
    const props = {
        success: true,
        user: {},
        currentUser: {},
    };

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const collectionUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/collection/user-collections/${query.username}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([
        currentUserResponse,
        collectionUserResponse,
    ]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.currentUser = await promises[0].json();
        props.user = await promises[1].json();
    }

    return props;
};

export default Collections;
