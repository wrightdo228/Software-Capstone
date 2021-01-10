import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../general/Modal';

const CollectionItem = styled.div`
    cursor: pointer;
`;

const CollectionsModal = ({ postId, open, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const getCollections = async () => {
            const response = await fetch(`/api/collection`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                setCollections(jsonResponse);
            }

            setLoading(false);
        };

        getCollections();
    }, []);

    const addToCollection = async (collectionId) => {
        const response = await fetch(
            `/api/collection/${collectionId}/${postId}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
            },
        );

        if (response.ok) {
            console.log('successfully added');
        } else {
            console.log("couldn't add to collection");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {collections.map((collection) => (
                        <CollectionItem
                            onClick={() => addToCollection(collection._id)}
                            key={collection._id}
                        >
                            <img
                                src={collection.image}
                                alt="collection"
                                aria-hidden
                            />
                            {collection.title}
                        </CollectionItem>
                    ))}
                </>
            )}
        </Modal>
    );
};

CollectionsModal.propTypes = {
    postId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CollectionsModal;
