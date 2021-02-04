import React from "react";
import PropTypes from "prop-types";

const LazyPrefetch = ({ msg }) => <div>LazyPrefetch says: {msg}</div>;

LazyPrefetch.propTypes = {
    msg: PropTypes.string.isRequired
};

export default LazyPrefetch;
