// classes
class TestPlugin {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    run(): void {
        console.log(`${this.name} is running!`);
    }
}

// arrow functions
const main = (): void => {
    const pluginOne = new TestPlugin("One");
    pluginOne.run();
};

main();

//map with pow
[1, 2, 3].map(number => number ** 2);

// shorthand Object method
const shorthand = 123;
const obj = {
    shorthand,
    test(): string {
        return "test";
    }
};

// spread
const arr = [1, 2, 3, 4, 5];
const spreadArr = [...arr];
console.log(obj, spreadArr);
