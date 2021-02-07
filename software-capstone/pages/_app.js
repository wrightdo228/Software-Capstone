import '../styles/globals.css';
import App from 'next/app';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/general/Layout';

function MyApp({ Component, pageProps, currentUser }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const { req } = appContext;
    let currentUser = null;

    // if (appContext.pathname !== '/login') {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        currentUser = await response.json();
    }
    // }

    const appProps = await App.getInitialProps(appContext);

    return { ...appProps, currentUser };
};

export default MyApp;
