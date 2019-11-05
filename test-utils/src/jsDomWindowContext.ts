const fs = require("fs");
import { DOMWindow, JSDOM } from "jsdom";

interface JsDomWindowContextOptions {
    js: [];
    css: [];
    html: String;
}

export function jsDomWindowContext(
    options: Partial<JsDomWindowContextOptions> = {}
) {
    const jsFiles = options.js ? [].concat(options.js) : [];
    const cssFiles = options.css ? [].concat(options.css) : [];
    const html = options.html || "";

    function evalJsFile(dom: any, fileName: String) {
        const fileContents = fs.readFileSync(fileName, "utf-8");
        dom.window.eval(fileContents);
    }

    return new Promise((resolve, reject) => {
        let dom: any;

        try {
            const styles = cssFiles
                .map(fileName => {
                    const fileContents = fs.readFileSync(fileName, "utf-8");
                    return `<style>${fileContents}</style>`;
                })
                .join("");
            dom = new JSDOM(
                `<html><head>${styles}</head><body>${html}</body></html>`,
                {
                    runScripts: "outside-only"
                }
            );
            jsFiles.forEach(fileName => {
                evalJsFile(dom, fileName);
            });
        } catch (e) {
            return reject(e);
        }

        dom.window.addEventListener("load", () =>
            process.nextTick(() =>
                resolve({
                    window: dom.window,
                    document: dom.window.document,
                    evalJsFile: evalJsFile.bind(null, dom)
                })
            )
        );
    });
}
