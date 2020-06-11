import { LoaderOptions } from "sass-loader/interfaces";
import SassOptions = LoaderOptions.SassOptions;

const path = require("path");

export function FrontlineNodeSassConfig(sassOptions?: SassOptions) {
    return {
        sourceMap: true,
        sassOptions: {
            importer: [
                require("node-sass-json-importer")({
                    ...(sassOptions?.includePaths && {
                        resolver: function(dir: string, url: string): string {
                            return url.startsWith("~/")
                                ? path.resolve(dir, url.substr(2))
                                : path.resolve(dir, url);
                        }
                    })
                }),
                require("node-sass-glob-importer")()
            ],
            ...sassOptions
        }
    };
}
