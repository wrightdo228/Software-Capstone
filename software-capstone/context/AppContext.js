import { useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

const ContextProvider = ({ value, children }) => (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
);

ContextProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

/* eslint react-hooks/rules-of-hooks: 0 */
export const useContextValue = useContext(AppContext);

export default ContextProvider;
