import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
    padding: 8px 30px;
    display: flex;
    align-items: center;

    :hover {
        cursor: pointer;
        svg {
            fill: #a81010;
            transition: fill 0.25s ease;
        }
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

const UserCardSection = ({ children }) => <Container>{children}</Container>;

UserCardSection.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

export default UserCardSection;
