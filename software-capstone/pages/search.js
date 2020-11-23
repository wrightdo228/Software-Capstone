import styled from 'styled-components';
import PropTypes from 'prop-types';
import Posts from '../components/posts/Posts';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 75px auto;
    max-width: 1000px;

    .search-params {
        color: #0092e4;
    }

    .search-title {
        font-size: 20px;
        margin-bottom: 45px;
    }
`;

const Search = ({ posts, searchParams }) => (
    <Container>
        <h2 className="search-title">
            Results for <span className="search-params">"{searchParams}"</span>
        </h2>
        <Posts posts={posts} />
    </Container>
);

Search.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
    searchParams: PropTypes.string.isRequired,
};

Search.getInitialProps = async ({ query, req }) => {
    const props = { posts: [], success: false, searchParams: '' };
    const { searchParams } = query;
    const cookie = req ? { cookie: req.headers.cookie } : undefined;

    const searchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/search/${searchParams}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    if (searchResponse.ok) {
        props.posts = await searchResponse.json();
        props.success = true;
        props.searchParams = searchParams ? searchParams.trim() : '';
    } else {
        console.log('failed');
    }

    return props;
};

export default Search;
