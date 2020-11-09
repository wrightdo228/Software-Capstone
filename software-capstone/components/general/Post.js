import styled from 'styled-components';
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import CodePreview from './CodePreview';

const Container = styled.div`
    padding: 57px 68px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #c4c4c4;
    box-shadow: 10px 10px 11px rgba(201, 201, 201, 0.25);
    flex-grow: 1;
`;

const LeftSide = styled.div`
    margin-right: 53px;

    a {
        font-size: 12px;
        display: block;
    }

    .post-avatar {
        margin-bottom: 14px;
    }
`;

const RightSide = styled.div`
    .post-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 30px;
    }
`;

const BasicContent = styled.div`
    display: flex;
`;

const Post = () => (
    <Container>
        <BasicContent>
            <LeftSide>
                <Link href="#">
                    <a className="post-avatar">
                        <UserAvatar />
                    </a>
                </Link>
                <Link href="#">
                    <a className="username">RandomUser</a>
                </Link>
            </LeftSide>
            <RightSide>
                <h5 className="post-title">Some Random title here</h5>
                <p className="post-body">Here is the text content</p>
            </RightSide>
        </BasicContent>
        <CodePreview />
    </Container>
);

Post.propTypes = {};

export default Post;
