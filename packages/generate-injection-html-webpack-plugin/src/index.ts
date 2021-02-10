import Handlebars from "handlebars";

const path = require("path");
const fs = require("fs");

// Safari hack from https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
const safariFixScript = `<script>!function(){var t,n=document.createElement("script");!("noModule"in n)&&"onbeforeload"in n&&(t=!1,document.addEventListener("beforeload",function(e){if(e.target===n)t=!0;else if(!e.target.hasAttribute("nomodule")||!t)return;e.preventDefault()},!0),n.type="module",n.src=".",document.head.appendChild(n),n.remove())}();</script>`;

export interface FrontlineAssetsManifestTemplatesOptions {
    headerTemplatePath?: string;
    bodyTemplatePath?: string;
    manifestPaths: Record<string, string>;
    outputPath?: string;
}

export const compileTemplates = ({
    headerTemplatePath,
    bodyTemplatePath,
    manifestPaths,
    outputPath
}: FrontlineAssetsManifestTemplatesOptions) => {
    const templateContent: Record<string, any> = {};
    const templates: Record<string, HandlebarsTemplateDelegate> = {};
    const compiledTemplates: Record<string, string> = {};

    const _headerTemplatePath =
        headerTemplatePath || path.resolve(__dirname, "./head.hbs");
    const _bodyTemplatePath =
        bodyTemplatePath || path.resolve(__dirname, "./body.hbs");
    const _outputPath = outputPath || "dist";

    if (Object.keys(manifestPaths).length === 0) {
        throw new Error("missing manifestPath");
    }

    /*
     * Legacy - scripts in body, other assets in head
     * Modern - all assets in head
     * Legacy + Modern - all assets in head
     */

    let data: Record<string, any> = {
        manifests: {},
        safariFixScript,
        injectSafariScript: manifestPaths.legacy && manifestPaths.modern,
        useScriptsInBody: manifestPaths.legacy && !manifestPaths.modern,
        useModernStyling: !manifestPaths.legacy && manifestPaths.modern
    };

    Object.keys(manifestPaths).forEach(k => {
        try {
            data.manifests[k] = JSON.parse(
                fs.readFileSync(manifestPaths[k], "utf-8")
            );
        } catch (e) {
            throw new Error(e);
        }
    });

    try {
        templateContent.header = fs.readFileSync(_headerTemplatePath, "utf-8");
    } catch (e) {
        throw new Error(e);
    }

    try {
        templateContent.body = fs.readFileSync(_bodyTemplatePath, "utf-8");
    } catch (e) {
        throw new Error(e);
    }

    Object.keys(templateContent).forEach(k => {
        templates[k] = Handlebars.compile(templateContent[k]);
    });

    Object.keys(templates).forEach(k => {
        compiledTemplates[k] = templates[k](data);
    });

    Object.keys(compiledTemplates).forEach(k => {
        try {
            fs.writeFileSync(
                path.resolve(_outputPath, `${k}.assets-manifest.html`),
                compiledTemplates[k],
                "utf-8"
            );
        } catch (e) {
            throw new Error(e);
        }
    });
};
