import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../general/Modal';

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
        height: 350px;
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

const BottomContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    #sandbox-input {
        max-width: 200px;
    }
`;

const CreatePost = ({ onClose, open }) => {
    const [title, setTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [sandboxLink, setSandboxLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/post', {
            method: 'POST',
            body: JSON.stringify({
                title,
                postBody,
                sandboxLink,
            }),
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
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
                <label htmlFor="body">
                    Body
                    <textarea
                        value={postBody}
                        onChange={(e) => setPostBody(e.target.value)}
                    />
                    {/* <TextEditor setBodyHtml={setBodyHtml} /> */}
                </label>
                <BottomContainer>
                    <input
                        value={sandboxLink}
                        onChange={(e) => setSandboxLink(e.target.value)}
                        id="sandbox-input"
                        type="text"
                        placeholder="Code Sandbox Link"
                    />
                    <button type="submit">Publish</button>
                </BottomContainer>
            </Form>
        </Modal>
    );
};

CreatePost.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default CreatePost;
