import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
    padding: 8px 30px;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
        color: #a81010;
    }

    &:hover svg path {
        fill: #a81010;
        transition: fill 0.2s ease;
    }

    a {
        display: flex;
        align-items: center;
    }

    svg {
        margin-right: 13px;
    }

    #heart {
        margin-right: 17px;
    }
`;

const UserCardSection = ({ children, onClick }) => (
    <Container onClick={onClick}>{children}</Container>
);

UserCardSection.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    onClick: PropTypes.func,
};

export default UserCardSection;
