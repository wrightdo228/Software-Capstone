import styled from 'styled-components';
import PropTypes from 'prop-types';

const Image = styled.img`
    width: ${({ type }) => (type === 'regular' ? '81px' : '40px')};
    height: ${({ type }) => (type === 'regular' ? '81px' : '40px')};
    border: 2px solid #ba0505;
    object-fit: cover;
    border-radius: 10px;
`;

const UserAvatar = ({ type, avatarUrl }) => (
    <Image
        type={type}
        src={avatarUrl || '/images/placeholders/blank-avatar.jpg'}
    />
);

UserAvatar.defaultProps = {
    type: 'regular',
};

UserAvatar.propTypes = {
    type: PropTypes.oneOf(['regular', 'mini']),
    avatarUrl: PropTypes.string,
};

export default UserAvatar;
