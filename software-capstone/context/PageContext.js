import { useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const PageContext = createContext();

const PageContextProvider = ({ value, children }) => (
    <PageContext.Provider value={value}>{children}</PageContext.Provider>
);

PageContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

export const usePageContextValue = () => useContext(PageContext);

export default PageContextProvider;
