import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader/root";

import loadable from "@loadable/component";

import "./App.scss";
import Eager from "~/components/eager/Eager";
import { TheLibrary } from "~/utils/the-util";

const Lazy = loadable(() =>
    import(
        /* webpackChunkName: "lazy" */
        "~/components/lazy/Lazy"
    )
);

const LazyPrefetch = loadable(() =>
    import(
        /* webpackChunkName: "lazy-prefetch", webpackPrefetch: true */
        "~/components/lazy-prefetch/LazyPrefetch"
    )
);

const LazyPreload = loadable(() =>
    import(
        /* webpackChunkName: "lazy-preload", webpackPreload: true */
        "~/components/lazy-preload/LazyPreload"
    )
);

const LazyPreloadPrefetch = loadable(() =>
    import(
        /* webpackChunkName: "lazy-preload-prefetch", webpackPreload: true, webpackPrefetch: true */
        "~/components/lazy-preload/LazyPreload"
    )
);

const theLibraryInstance = new TheLibrary();

import locale from "../public/translation/da-DK.json";

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
        return (
            <div className="app">
                <h1>Performance App Ny</h1>
                <p>{locale.hello}</p>
                <Eager msg="im not dynamically imported :-/" />
                <Lazy msg="Lazy" />
                <LazyPrefetch msg="Lazy + Prefetch" />
                <LazyPreload msg="Lazy + Preload" />
                <LazyPreloadPrefetch msg="Lazy + Preload + Prefetch" />
                <hr />
                <button onClick={this.theLibraryAsync}>theLibraryAsync</button>
                <button onClick={this.theLibrarySync}>theLibrarySync</button>
            </div>
        );
    }
}

export default hot(App);
