import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../general/Modal';
import useImageUpload from '../../customHooks/useImageUpload';
import { usePageContextValue } from '../../context/PageContext';

const Form = styled.form`
    label {
        display: block;
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 14px;
    }

    textarea {
        font-weight: 400;
        padding: 10px;
        height: 150px;
        width: 100%;
        border: 1px solid #c4c4c4;
        border-radius: 10px;
        resize: none;
        font-family: Roboto;
        outline: none;
        margin-top: 5px;
    }

    input {
        margin-top: 5px;
    }

    #private-checkbox {
        width: unset;
        height: unset;
    }
`;

const CreateCollection = ({ onClose, open }) => {
    const [title, setTitle] = useState('');
    const { collections, setCollections, currentUser } = usePageContextValue();
    const [description, setDescription] = useState('');
    const [privateChecked, setPrivateChecked] = useState(false);
    const [imageFile, handleImageChange, previewImage] = useImageUpload();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', imageFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('private', privateChecked);

        const response = await fetch('/api/collection', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.ok) {
            const newCollection = await response.json();
            setCollections([
                {
                    ...newCollection,
                    creator: {
                        _id: currentUser.id,
                        avatar: currentUser.avatar,
                        username: currentUser.username,
                    },
                },
                ...collections,
            ]);

            onClose();
        } else {
            console.log('fail...');
        }
    };

    return (
        <Modal onClose={onClose} open={open}>
            <Form onSubmit={handleSubmit}>
                <label htmlFor="title">
                    Title
                    <input
                        required
                        id="title"
                        value={title}
                        maxLength="100"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength="320"
                    />
                </label>
                {previewImage && <img src={previewImage} alt="preview" />}
                <input type="file" required onChange={handleImageChange} />
                <label htmlFor="private-checkbox">
                    Private:
                    <input
                        id="private-checkbox"
                        value={privateChecked}
                        type="checkbox"
                        onChange={(e) => setPrivateChecked(e.target.checked)}
                    />
                </label>
                <button type="submit">Create</button>
            </Form>
        </Modal>
    );
};

CreateCollection.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default CreateCollection;
