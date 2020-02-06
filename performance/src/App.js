import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader/root";

import loadable from "@loadable/component";

import "./App.scss";
import Eager from "./components/eager/Eager";
import { TheLibrary } from "./utils/the-util";
const Lazy = loadable(() => import("./components/lazy/Lazy"));

const theLibraryInstance = new TheLibrary();

import locale from "../public/translation/da-DK";

class App extends PureComponent {
    state = {
        env: process.env
    };

    static propsTypes = {
        initialProps: PropTypes.object
    };

    static defaultProps = {
        initialProps: {}
    };

    theLibraryAsync = async () => {
        const result = await theLibraryInstance.iCanHaveDynamicImportAsyncAwaitAndAllThat();

        console.info(
            "Yay we support async await and dynamic imports <3",
            result
        );
    };

    theLibrarySync = () => {
        theLibraryInstance.iCanDoSpreadOnArrays();
        theLibraryInstance.iCanDoSpreadOnObjectLiterals();
        theLibraryInstance.iCanDoNullishCoalescingOperator();
        theLibraryInstance.iCanDoOptionalChaining();
        console.info(theLibraryInstance.iCanHaveClassProperties);
    };

    render() {
        const { initialProps } = this.props;

        return (
            <div className="app">
                <h1>Performance App Ny</h1>
                <p>{locale.hello}</p>
                <Eager msg="im not dynamically imported :-/" />
                <Lazy msg="im AM dynamically imported :-D" />
                <hr />
                <button onClick={this.theLibraryAsync}>theLibraryAsync</button>
                <button onClick={this.theLibrarySync}>theLibrarySync</button>
            </div>
        );
    }
}

export default hot(App);
