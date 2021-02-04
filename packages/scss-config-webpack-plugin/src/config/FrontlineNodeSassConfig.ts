import { Options as SassOptions } from "sass";
const path = require("path");

export function FrontlineNodeSassConfig(sassOptions?: SassOptions) {
    return {
        // Prefer `dart-sass`
        implementation: require("sass"),
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
