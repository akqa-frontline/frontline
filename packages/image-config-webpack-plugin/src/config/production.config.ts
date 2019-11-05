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
                        loader: require.resolve("url-loader"),
                        options: {
                            name: options.name,
                            limit: 10000 // 10bk - same as CRA
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
