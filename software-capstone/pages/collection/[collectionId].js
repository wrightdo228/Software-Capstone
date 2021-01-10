const Collection = ({ collection, isCreator, isContributor }) => (
    <div>here</div>
);

Collection.getInitialProps = async ({ query, req }) => {
    let props = {
        success: false,
        collection: null,
        isCreator: false,
        isContributor: false,
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/collection/${query.collectionId}`,
        {
            credentials: 'include',
            headers: req ? { cookie: req.headers.cookie } : undefined,
        },
    );

    if (response.ok) {
        const jsonObject = await response.json();
        props.success = true;
        props = { ...props, ...jsonObject };
    }

    console.log(props);
    return props;
};

export default Collection;
