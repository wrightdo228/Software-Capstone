import styled from 'styled-components';
import PropTypes from 'prop-types';

const IFrame = styled.iframe`
    width: 100%;
    height: 370px;
    margin-top: 14px;
    border: 1px solid #000;
    border-radius: 10px;
`;

const CodePreview = ({ mode, sandboxId }) => (
    <IFrame
        title="random-i-frame"
        src={`https://codesandbox.io/embed/${sandboxId}?codemirror=1&view=${mode}`}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
);

CodePreview.defaultProps = {
    mode: 'editor',
};

CodePreview.propTypes = {
    mode: PropTypes.oneOf(['preview', 'editor']),
    sandboxId: PropTypes.string.isRequired,
};

export default CodePreview;
