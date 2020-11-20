import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Post from './Post';
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

const Posts = styled.div`
    flex-grow: 1;
    max-width: 1000px;

    > div {
        margin-bottom: 65px;
    }

    > div:last-child {
        margin-bottom: 0;
    }
`;

const Timeline = ({ posts, user }) => {
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
                <Posts>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </Posts>
            </Container>
        </>
    );
};

Timeline.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.object.isRequired,
};

export default Timeline;
