import React from "react";
import PropTypes from "prop-types";

const Text = text => <p>{text}</p>;

Text.propTypes = {
    text: PropTypes.string.isRequired
};

Text.defaultProps = {
    text: "default"
};
