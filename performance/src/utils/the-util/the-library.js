export default class TheLibrary {
    iCanHaveClassProperties = true;

    iCanHaveDynamicImportAsyncAwaitAndAllThat = async () => {
        const heavyFunction = await import("./heavy-dependency.js");
        const resultFromFunction = heavyFunction.fakeItTillYouMakeIt(
            "doesnt matter"
        );

        return resultFromFunction;
    };

    iCanDoSpreadOnArrays = () => {
        const parts = ["shoulders", "knees"];
        const lyrics = ["head", ...parts, "and", "toes"];

        console.info(lyrics);

        return lyrics;
    };

    iCanDoSpreadOnObjectLiterals = () => {
        const obj1 = { foo: "bar", x: 42 };
        const obj2 = { foo: "baz", y: 13 };

        const mergedObject = { ...obj1, ...obj2 };

        console.info(mergedObject);

        return mergedObject;
    };
}
