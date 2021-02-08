import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

const OverlayContainer = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const ModalContainer = styled.div`
    max-width: 1000px;
    max-height: 500px;
    overflow: auto;
    width: 100%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px 100px;
    border-radius: 10px;
    z-index: 1000;
`;

const Modal = ({ open, onClose, children }) => {
    const overlay = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (overlay.current && overlay.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [overlay, onClose]);

    return (
        <>
            <OverlayContainer ref={overlay} />
            <ModalContainer>{children}</ModalContainer>
        </>
    );
};

Modal.propTypes = {
    open: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

export default Modal;
