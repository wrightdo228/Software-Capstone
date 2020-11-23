import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';
import Timeline from '../components/posts/Timeline';

const Home = ({ user, posts }) => (
    <div>
        <Head>
            <title>Donneil's Capstone</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Timeline posts={posts} user={user} />
    </div>
);

Home.propTypes = {
    user: PropTypes.object.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Home.getInitialProps = async ({ req }) => {
    const props = { success: false, user: {}, posts: [] };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    const feedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/main-feed`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        const jsonObject = await response.json();
        props.success = true;
        props.user = jsonObject;
        props.posts = await feedResponse.json();
        return props;
    }

    return {};
};

export default Home;
