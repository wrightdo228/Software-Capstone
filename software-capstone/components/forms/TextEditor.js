import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const TextContainer = styled.div`
    font-weight: 400;
    padding: 10px;
    height: 350px;
    width: 100%;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    cursor: pointer;
`;

const TextEditor = ({ setBodyHtml }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const handleKeyCommand = (command, newEditorState) => {
        const newState = RichUtils.handleKeyCommand(newEditorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    useEffect(() => {
        const state = editorState.getCurrentContent();
        setBodyHtml(stateToHTML(state));
    }, [editorState, setBodyHtml]);

    return (
        <TextContainer>
            <Editor
                handleKeyCommand={handleKeyCommand}
                editorState={editorState}
                onChange={setEditorState}
            />
        </TextContainer>
    );
};

TextEditor.propTypes = {
    setBodyHtml: PropTypes.func.isRequired,
};

export default TextEditor;
