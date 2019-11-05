// Supports static imports
import StaticImport from "./static-import";
const staticImport = new StaticImport();

// Supports dynamic imports
import("./dynamic-import").then(DynamicImport => {
    const dynamicImport = new DynamicImport();
    console.error("Dynamic Import", dynamicImport);
});
