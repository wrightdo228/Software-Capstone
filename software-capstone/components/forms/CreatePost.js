import { json } from 'body-parser';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../general/Modal';
import TextEditor from './TextEditor';

const Form = styled.form`
    label {
        display: block;
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 14px;
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
    const [bodyHtml, setBodyHtml] = useState('');
    const [sandboxLink, setSandboxLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/post', {
            method: 'POST',
            body: JSON.stringify({
                title,
                postBody: bodyHtml,
                sandboxLink,
            }),
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Success...');
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
                    <TextEditor setBodyHtml={setBodyHtml} />
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
