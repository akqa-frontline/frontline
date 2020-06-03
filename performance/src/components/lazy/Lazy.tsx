import React from "react";
import PropTypes from "prop-types";

import styles from "./Lazy.module.scss";

import JpgImage from "../../assets/images/file.jpg";
import GifImage from "../../assets/images/file.gif";
import PngImage from "../../assets/images/file.png";
import SvgImage from "../../assets/images/file.svg";
import TinyPngImage from "../../assets/images/1kb.png";
import SvgInline from "../../assets/icons/arrow.inline.svg";

import svgUrl, {
    ReactComponent as SvgComponent
} from "../../assets/icons/icon.component.svg";

const Lazy = ({ msg }) => (
    <div className={styles.lazy}>
        Lazy says: {msg}
        <img src={JpgImage} alt="Jpg Image" />
        <img src={GifImage} alt="Gif Image" />
        <img src={PngImage} alt="Png Image" />
        <img src={SvgImage} alt="Svg Image" />
        <img src={TinyPngImage} alt="Tiny PNG" />
        <img src={svgUrl} alt="SVG Component but in url format" />
        <SvgComponent width={33} height={120} fill="red" />
        <div dangerouslySetInnerHTML={{ __html: SvgInline }} />
    </div>
);

Lazy.propTypes = {
    msg: PropTypes.string.isRequired
};

export default Lazy;
