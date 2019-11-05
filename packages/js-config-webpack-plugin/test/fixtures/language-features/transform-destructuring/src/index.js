const [a, b, ...rest] = [10, 20, 30, 40, 50];
// Stage 4(finished) proposal
({ a, b, ...rest } = { a: 10, b: 20, c: 30, d: 40 });
