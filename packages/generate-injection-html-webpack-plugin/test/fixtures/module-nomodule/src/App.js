import React from "react";
import MyComponent from "./MyComponent";
import { ReactComponent } from "./arrow.component.svg";

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        window.MyComponentClass = MyComponent;
        window.MyComponentInstanceWithProps = React.createElement(MyComponent, {
            text: "ISWP"
        });
    }

    render() {
        return (
            <div>
                <h1>React App</h1>
                <MyComponent text={"World"} />
                <MyComponent />
                <ReactComponent />
            </div>
        );
    }
}

export default App;
