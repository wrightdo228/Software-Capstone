import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Post from '../../components/posts/Post';
import Comment from '../../components/posts/Comment';
import PageContextProvider from '../../context/PageContext';

const Container = styled.div`
    max-width: 1000px;
    width: 100%;
    margin: 75px auto;
`;

const CommentForm = styled.form`
    margin-top: 25px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 10px 10px 11px rgb(201 201 201 / 25%);
    border: 1px solid #c4c4c4;
    padding: 30px 65px 20px 70px;

    textarea {
        display: block;
        width: 100%;
        height: 100px;
        border-radius: 10px;
        border: 1px solid #c4c4c4;
        margin-bottom: 10px;
        resize: none;
        outline: none;
        padding: 10px;
        font-family: Roboto;
    }

    #functions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .green-text {
        color: green;
    }

    .red-text {
        color: red;
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-top: 20px;
`;

const PostPage = ({ post, success, currentUser }) => {
    const [comments, setComments] = useState(post.comments);
    const [comment, setComment] = useState('');
    const [commentCharacterCount, setCommentWordCount] = useState(0);
    const charactersRemaining = 320 - commentCharacterCount;

    const value = {
        currentUser,
    };

    useEffect(() => {
        setCommentWordCount(comment.length);
    }, [comment]);

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
            const newComment = {
                comment,
                user: {
                    username: currentUser.username,
                    avatar: currentUser.avatar,
                },
            };

            setComments([newComment, ...comments]);
            setComment('');
        } else {
            console.log('Fail...');
        }
    };

    return (
        <PageContextProvider value={value}>
            <Container>
                {success ? (
                    <>
                        <Post onPostPage post={post} />
                        <CommentForm onSubmit={handleSubmit}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div id="functions">
                                <button type="submit">Post</button>
                                {commentCharacterCount > 0 && (
                                    <span
                                        className={
                                            charactersRemaining < 0
                                                ? 'red-text'
                                                : 'green-text'
                                        }
                                    >
                                        {charactersRemaining}
                                    </span>
                                )}
                            </div>
                        </CommentForm>
                        {comments.map((postComment) => (
                            <Comment
                                comment={postComment}
                                key={postComment._id}
                            />
                        ))}
                    </>
                ) : (
                    <Title>Cannot access post</Title>
                )}
            </Container>
        </PageContextProvider>
    );
};

PostPage.propTypes = {
    post: PropTypes.object.isRequired,
    success: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired,
};

PostPage.getInitialProps = async ({ query, req }) => {
    const props = { success: true, post: {}, currentUser: {} };

    const postResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${query.postId}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([postResponse, currentUserResponse]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.post = await promises[0].json();
        props.currentUser = await promises[1].json();
    }

    return props;
};

export default PostPage;
