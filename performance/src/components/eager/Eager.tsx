import React from "react";
import PropTypes from "prop-types";

import styles from "./Eager.module.scss";
import colors from "../../tokens/colors.json";

const Eager = ({ msg }) => (
    <div className={styles.eager}>
        Eager says: <span style={{ color: colors.grape[3] }}>{msg}</span>
    </div>
);

Eager.propTypes = {
    msg: PropTypes.string.isRequired
};

export default Eager;
