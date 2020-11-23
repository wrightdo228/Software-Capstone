import styled from 'styled-components';
import PropTypes from 'prop-types';

const Image = styled.img`
    width: ${({ type }) => (type === 'regular' ? '81px' : '40px')};
    height: ${({ type }) => (type === 'regular' ? '81px' : '40px')};
    border: 2px solid #ba0505;
    object-fit: cover;
    border-radius: 10px;
`;

const UserAvatar = ({ type }) => (
    <Image
        type={type}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTASuKF-9t-jE1Isaql0sxlcTmElACM51FanQ&usqp=CAU"
    />
);

UserAvatar.defaultProps = {
    type: 'regular',
};

UserAvatar.propTypes = {
    type: PropTypes.oneOf(['regular', 'mini']),
};

export default UserAvatar;
