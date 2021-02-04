import React from "react";
import PropTypes from "prop-types";

const LazyPreload = ({ msg }) => <div>LazyPreload says: {msg}</div>;

LazyPreload.propTypes = {
    msg: PropTypes.string.isRequired
};

export default LazyPreload;
