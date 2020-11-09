import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from './Icon';

const Button = styled.button`
    cursor: pointer;
    background-color: transparent;
    padding: 0;

    & svg {
        &:hover {
            fill: #a81010;
        }
    }
`;

const IconButton = ({ type, onClick }) => (
    <Button onClick={onClick} type="button">
        <Icon type={type} />
    </Button>
);

IconButton.propTypes = {
    type: PropTypes.oneOf(['favorite', 'collection', 'new']),
    onClick: PropTypes.func,
};

export default IconButton;
