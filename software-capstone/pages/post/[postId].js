import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Post from '../../components/posts/Post';
import Comment from '../../components/posts/Comment';

const Container = styled.div`
    max-width: 1000px;
    width: 100%;
    margin: 75px auto;
`;

const replies = [
    {
        _id: 1,
        comment: 'test',
        user: {
            username: 'spencer',
        },
        replies: [
            {
                _id: 2,
                comment: 'test',
                user: {
                    username: 'spencer',
                },
                replies: [
                    {
                        _id: 3,
                        comment: 'test',
                        user: {
                            username: 'spencer',
                        },
                        replies: [],
                    },
                ],
            },
            {
                _id: 4,
                comment: 'test',
                user: {
                    username: 'spencer',
                },
                replies: [
                    {
                        _id: 5,
                        comment: 'test',
                        user: {
                            username: 'spencer',
                        },
                        replies: [],
                    },
                    {
                        _id: 6,
                        comment: 'test',
                        user: {
                            username: 'spencer',
                        },
                        replies: [],
                    },
                ],
            },
        ],
    },
];

const PostPage = ({ post, success }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/post/comment', {
            method: 'POST',
            body: JSON.stringify({
                postId: post._id,
                comment,
            }),
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Success...');
        } else {
            console.log('Fail...');
        }
    };

    return (
        <Container>
            {success ? (
                <>
                    <Post post={post} />
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit">Post</button>
                    </form>
                    {replies.map((postComment) => (
                        <Comment comment={postComment} key={postComment._id} />
                    ))}
                </>
            ) : (
                <div>post not found</div>
            )}
        </Container>
    );
};

PostPage.propTypes = {
    post: PropTypes.object.isRequired,
    success: PropTypes.bool.isRequired,
};

PostPage.getInitialProps = async ({ query, req }) => {
    const props = { success: false, post: {} };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${query.postId}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        props.post = await response.json();
        props.success = true;
    }

    return props;
};

export default PostPage;
