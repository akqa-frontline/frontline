interface Animal {
    name: string;
}

interface Adventurer {
    name: string;
    cat: Animal;
    dog?: Animal;
}

export default class TheLibrary {
    iCanHaveClassProperties = "this is a class property";

    iCanHaveDynamicImportAsyncAwaitAndAllThat = async () => {
        const heavyFunction = await import("./heavy-dependency");
        const resultFromFunction = heavyFunction.fakeItTillYouMakeIt(
            "doesnt matter"
        );

        return resultFromFunction;
    };

    iCanDoSpreadOnArrays = () => {
        const parts = ["shoulders", "knees"];
        const lyrics = ["head", ...parts, "and", "toes"];

        // expected output: ["head", "shoulders", "knees", "and", "toes"];
        console.log("spread operator - array", lyrics);
    };

    iCanDoSpreadOnObjectLiterals = () => {
        const obj1 = { foo: "bar", x: 42 };
        const obj2 = { foo: "baz", y: 13 };

        const mergedObject = { ...obj1, ...obj2 };

        // expected output: {foo: "baz", x: 42, y: 13};
        console.log("spread operator - object", mergedObject);
    };

    iCanDoNullishCoalescingOperator = () => {
        const baz = 0 ?? 42;

        // expected output: 0
        console.log("nullish coalescing operator", baz);
    };

    iCanDoOptionalChaining = () => {
        const adventurer: Adventurer = {
            name: "Alice",
            cat: {
                name: "Dinah"
            }
        };

        const dogName = adventurer.dog?.name;

        // expected output: undefined
        console.log("optional chaining", dogName);
    };
}
