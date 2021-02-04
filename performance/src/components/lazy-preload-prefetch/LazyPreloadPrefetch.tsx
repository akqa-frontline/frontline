import React from "react";
import PropTypes from "prop-types";

const LazyPreloadPrefetch = ({ msg }) => (
    <div>LazyPreloadPrefetch says: {msg}</div>
);

LazyPreloadPrefetch.propTypes = {
    msg: PropTypes.string.isRequired
};

export default LazyPreloadPrefetch;
