import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import UserAvatar from '../general/UserAvatar';
import IconButton from '../buttons/IconButton';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .comment-subcontainer {
        width: 95%;
    }

    .container {
        width: 100%;
        margin-top: 25px;
        background-color: #fff;
        padding: 30px 65px 20px 70px;
        border: 1px solid #c4c4c4;
        border-radius: 10px;
        box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    }

    .main-content {
        display: flex;
    }

    a {
        display: block;
        font-weight: 700;
        font-size: 12px;
        color: #0092e4;
    }

    .left-side {
        margin-right: 40px;
    }

    p {
        padding-top: 10px;
        white-space: pre-wrap;
    }

    .comment-functions {
        display: flex;
        justify-content: space-between;
    }

    .reply-enter {
        opacity: 0;
        transform: scale(0.95);
    }

    .reply-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 200ms ease-in, transform 200ms ease-in;
    }

    .reply-exit {
        opacity: 1;
        transform: scale(1);
    }

    .reply-exit-active {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 200ms ease-in, transform 200ms ease-in;
    }

    .inner-container {
        display: flex;

        img {
            margin-right: 40px;
        }

        textarea {
            display: block;
            width: 100%;
            flex-grow: 1;
            border: 1px solid #c4c4c4;
            border-radius: 10px;
            resize: none;
            font-family: Roboto;
            padding: 10px;
            outline: none;
            height: 120px;
        }
    }
`;

function Comment({ comment }) {
    const [replyIsOpen, setReplyIsOpen] = useState(false);

    return (
        <Container>
            <div className="container">
                <div className="main-content">
                    <div className="left-side">
                        <Link href="#">
                            <a>
                                <UserAvatar avatarUrl={comment.user.avatar} />
                            </a>
                        </Link>
                    </div>
                    <p>{comment.comment}</p>
                </div>
                <div className="comment-functions">
                    <Link href="#">
                        <a>{comment.user.username}</a>
                    </Link>
                    {/* <IconButton
                        type="reply"
                        selected={replyIsOpen}
                        onClick={() => setReplyIsOpen(!replyIsOpen)}
                    /> */}
                </div>
            </div>
            {/* <CSSTransition
                in={replyIsOpen}
                timeout={200}
                classNames="reply"
                unmountOnExit
            >
                <div className="container">
                    <form className="inner-container">
                        <UserAvatar />
                        <textarea />
                    </form>
                </div>
            </CSSTransition>
            <div className="comment-subcontainer">
                {comment.replies.map((reply) => (
                    <Comment key={reply._id} comment={reply} />
                ))}
                </div> */}
        </Container>
    );
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
};

export default Comment;
