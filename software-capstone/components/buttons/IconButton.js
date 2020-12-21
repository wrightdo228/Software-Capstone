import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from './Icon';

const Button = styled.button`
    cursor: pointer;
    padding: 0;
    background-color: transparent;
    border: none;
    height: 24px;
    border-radius: 0;

    & svg path {
        transition: fill 200ms ease-in;
        ${({ selected }) => (selected ? 'fill: #a81010;' : '')}
    }

    &:hover {
        background-color: transparent;
    }

    &:hover svg path {
        fill: #a81010;
    }
`;

const IconButton = ({ type, onClick, selected }) => (
    <Button selected={selected} onClick={onClick} type="button">
        <Icon type={type} />
    </Button>
);

IconButton.propTypes = {
    type: PropTypes.oneOf(['favorite', 'collection', 'new', 'reply']),
    onClick: PropTypes.func,
    selected: PropTypes.bool,
};

export default IconButton;
