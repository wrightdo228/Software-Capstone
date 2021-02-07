import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Posts from './Posts';
import CreatePost from '../forms/CreatePost';
import UserCard from '../general/UserCard';

const Container = styled.div`
    display: flex;
    align-items: start;
    padding: 75px 108px;

    .user-card {
        margin-right: 70px;
    }
`;

const Timeline = ({ user }) => {
    const [createPostOpen, setCreatePostOpen] = useState(false);
    return (
        <>
            {createPostOpen && (
                <CreatePost onClose={() => setCreatePostOpen(false)} />
            )}
            <Container>
                <UserCard
                    user={user}
                    openCreatePost={() => setCreatePostOpen(true)}
                />
                <Posts currentUser={user} />
            </Container>
        </>
    );
};

Timeline.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Timeline;
