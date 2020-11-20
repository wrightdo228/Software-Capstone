import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from './Icon';

const Button = styled.span`
    cursor: pointer;

    &:hover svg {
        fill: #a81010;
    }
`;

const IconButton = ({ type, onClick }) => (
    <Button onClick={onClick} type="button">
        <Icon type={type} />
    </Button>
);

IconButton.propTypes = {
    type: PropTypes.oneOf(['favorite', 'collection', 'new', 'reply']),
    onClick: PropTypes.func,
};

export default IconButton;
