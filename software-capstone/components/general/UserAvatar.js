import styled from 'styled-components';

const Image = styled.img`
    width: 81px;
    height: 81px;
    border: 2px solid #ba0505;
    object-fit: cover;
    border-radius: 10px;
`;

const UserAvatar = () => (
    <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTASuKF-9t-jE1Isaql0sxlcTmElACM51FanQ&usqp=CAU" />
);

export default UserAvatar;
