import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../general/Modal';
import useImageUpload from '../../customHooks/useImageUpload';

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
`;

const CreateCollection = ({ onClose, open }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, handleImageChange, previewImage] = useImageUpload();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', imageFile);
        formData.append('title', title);
        formData.append('description', description);

        const response = await fetch('/api/collection', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.ok) {
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
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <img src={previewImage} alt="preview" />
                <input type="file" required onChange={handleImageChange} />
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
