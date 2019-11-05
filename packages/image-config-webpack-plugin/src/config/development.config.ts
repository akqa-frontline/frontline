import { FrontlineImageConfigWebpackPluginOptions } from "./FrontlineImageConfigWebpackPlugin";
import {
    FILE_REGEX,
    SVG_BUNDLE_REGEX,
    SVG_COMPONENT_REGEX,
    SVG_INLINE_REGEX
} from "../utils/file-extension";

export = (options: FrontlineImageConfigWebpackPluginOptions) => ({
    module: {
        rules: [
            {
                test: FILE_REGEX,
                exclude: [
                    SVG_INLINE_REGEX,
                    SVG_BUNDLE_REGEX,
                    SVG_COMPONENT_REGEX
                ],
                use: [
                    {
                        loader: require.resolve("file-loader"),
                        options: {
                            name: options.name
                        }
                    }
                ]
            },
            {
                test: SVG_INLINE_REGEX,
                use: [
                    {
                        loader: require.resolve("svg-inline-loader")
                    }
                ]
            }
        ]
    },
    plugins: []
});
