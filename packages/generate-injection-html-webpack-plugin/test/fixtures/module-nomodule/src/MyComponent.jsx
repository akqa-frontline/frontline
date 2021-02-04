import React from "react";
import PropTypes from "prop-types";

class MyComponent extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    static defaultProps = {
        text: "Frontline"
    };

    render() {
        return <h2>Hello {this.props.text}</h2>;
    }
}

export default MyComponent;
