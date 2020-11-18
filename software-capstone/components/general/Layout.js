import PropTypes from 'prop-types';
import Navbar from './Navbar';

const Layout = ({ children }) => (
    <div>
        <Navbar />
        {children}
    </div>
);

Layout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
};

export default Layout;
