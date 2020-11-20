import PropTypes from 'prop-types';

const Icon = ({ type }) => {
    const collection = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 3H5C3.9 3 3 3.89999 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89999 20.1 3 19 3ZM18 7.5H13V9.5H18V7.5ZM18 14.5H13V16.5H18V14.5ZM5 19H19V5H5V19ZM11 6H6V11H11V6ZM7 10H10V7H7V10ZM11 13H6V18H11V13ZM7 17H10V14H7V17Z"
                fill="black"
                fillOpacity="0.54"
            />
        </svg>
    );

    const follow = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 0H18C19.1 0 20 0.89999 20 2V14C20 15.1 19.1 16 18 16H6C4.90002 16 4 15.1 4 14V2C4 0.89999 4.90002 0 6 0ZM0 4H2V18H16V20H2C0.90002 20 0 19.1 0 18V4ZM18 14H6V2H18V14ZM13 12H11V9H8V7H11V4H13V7H16V9H13V12Z"
                fill="#A81010"
                fillOpacity="0.54"
            />
        </svg>
    );

    const newPost = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                fill="black"
                fillOpacity="0.54"
            />
        </svg>
    );

    const favorite = (
        <svg
            id="heart"
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 18.35L8.55 17.03C3.4 12.36 0 9.28 0 5.5C0 2.42 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.09C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.42 20 5.5C20 9.28 16.6 12.36 11.45 17.04L10 18.35Z"
                fill="black"
                fillOpacity="0.54"
            />
        </svg>
    );

    const reply = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 8.5V4.5L3 11.5L10 18.5V14.4C15 14.4 18.5 16 21 19.5C20 14.5 17 9.5 10 8.5Z"
                fill="black"
                fillOpacity="0.54"
            />
        </svg>
    );

    const selectedIcon = (() => {
        switch (type) {
            case 'favorite':
                return favorite;
            case 'new':
                return newPost;
            case 'collection':
                return collection;
            case 'reply':
                return reply;
            case 'follow':
                return follow;
            default:
                return favorite;
        }
    })();

    return selectedIcon;
};

Icon.propTypes = {
    type: PropTypes.oneOf(['favorite', 'collection', 'new', 'reply', 'follow']),
};

export default Icon;
