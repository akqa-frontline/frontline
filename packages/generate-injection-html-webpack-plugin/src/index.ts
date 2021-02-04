import Handlebars from "handlebars";

const path = require("path");
const fs = require("fs");

export interface FrontlineAssetsManifestTemplatesOptions {
    headerTemplatePath?: string;
    bodyTemplatePath?: string;
    manifestPath: string;
    outputPath?: string;
}

export const compileTemplates = ({
    headerTemplatePath,
    bodyTemplatePath,
    manifestPath,
    outputPath
}: FrontlineAssetsManifestTemplatesOptions) => {
    const templateContent: Record<string, any> = {};
    const templates: Record<string, HandlebarsTemplateDelegate> = {};
    const compiledTemplates: Record<string, string> = {};

    const _headerTemplatePath =
        headerTemplatePath || path.resolve(__dirname, "./head.handlebars");
    const _bodyTemplatePath =
        bodyTemplatePath || path.resolve(__dirname, "./body.handlebars");
    const _outputPath = outputPath || "dist";

    if (!manifestPath) {
        throw new Error("missing manifestPath");
    }

    let manifest: object;

    try {
        manifest = fs.readFileSync(manifestPath, "utf-8");
    } catch (e) {
        throw new Error(e);
    }

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
        compiledTemplates[k] = templates[k]({ manifest });
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
