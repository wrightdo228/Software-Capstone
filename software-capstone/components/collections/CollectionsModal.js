import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../general/Modal';

const CollectionItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #c4c4c4;
    margin-top: 20px;

    :hover {
        background-color: #ebe6e6;
    }
`;

const BlurContainer = styled.div`
    background-image: ${({ image }) =>
        `url(${image})` ||
        "url('https://hackernoon.com/hn-images/1*Kv-0AsHcK7WRrUDOH8YLIA.png')"};
    height: 59px;
    width: 100px;
    border-radius: 10px;
    background-size: cover;
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
            onClose();
        } else {
            alert("couldn't add, may already be a part of the collection");
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
                            <BlurContainer image={collection.image} />
                            <p>{collection.title}</p>
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
