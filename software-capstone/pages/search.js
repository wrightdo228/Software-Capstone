import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Posts from '../components/posts/Posts';
import PageContextProvider from '../context/PageContext';

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

const Search = ({ initialPosts, searchParams, currentUser }) => {
    const [posts, setPosts] = useState(initialPosts);
    const router = useRouter();

    const value = {
        posts,
        setPosts,
        currentUser,
    };

    useEffect(() => {
        const getPosts = async () => {
            const response = await fetch(
                `/api/post/search/${router.query.searchParams}`,
                {
                    credentials: 'include',
                },
            );

            if (response.ok) {
                const newPosts = await response.json();
                setPosts(newPosts);
            }
        };

        getPosts();
    }, [router.query]);

    return (
        <PageContextProvider value={value}>
            <Container>
                <h2 className="search-title">
                    Results for{' '}
                    <span className="search-params">"{searchParams}"</span>
                </h2>
                <Posts />
            </Container>
        </PageContextProvider>
    );
};

Search.propTypes = {
    initialPosts: PropTypes.arrayOf(PropTypes.object),
    currentUser: PropTypes.object.isRequired,
    searchParams: PropTypes.string.isRequired,
};

Search.getInitialProps = async ({ query, req }) => {
    const props = {
        initialPosts: [],
        success: true,
        searchParams: '',
        currentUser: {},
    };
    const { searchParams } = query;
    const cookie = req ? { cookie: req.headers.cookie } : undefined;

    const searchResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/search/${searchParams}`,
        {
            credentials: 'include',
            headers: cookie,
        },
    );

    const currentUserResponse = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const promises = await Promise.all([searchResponse, currentUserResponse]);

    promises.forEach((promise) => {
        if (!promise.ok) {
            props.success = false;
        }
    });

    if (props.success) {
        props.initialPosts = await promises[0].json();
        props.currentUser = await promises[1].json();
        props.searchParams = searchParams ? searchParams.trim() : '';
    } else {
        console.log('failed');
    }

    return props;
};

export default Search;
