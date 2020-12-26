import { chain } from 'lodash'
import { getRunner } from './core'

const calculate = async (promise: Promise<string[]>) => {
    const [e, buses] = (await promise)
    const estimate = parseInt(e)
    const closest = chain(buses)
        .split(',')
        .filter(c => c !== 'x')
        .map(c => parseInt(c))
        .map(t => ({ id: t, diff: (Math.ceil(estimate / t) * t) - estimate }))
        .sortBy('diff')
        .head()
        .value()

    return BigInt(closest.id * closest.diff).toString()
}

const calculate2 = async (promise: Promise<string[]>) => {
    const buses = chain((await promise)[1])
        .split(',')
        .map((c, i) => ({ delta: i, bus: c === 'x' ? -1 : parseInt(c) }))
        .filter(({ bus }) => bus !== -1)
        .value()

    const absoluteModulo = (a: number, b: number) => ((a % b) + b) % b;

    // returns x where (a * x) % b == 1
    // https://rosettacode.org/wiki/Modular_inverse
    const getInverse = (a, mod) => {
        const b = a % mod;
        const aux = (multplier: number) =>
            multplier === mod
                ? 1 : (b * multplier) % mod === 1
                    ? multplier : aux(multplier + 1)

        return aux(1)
    }

    const N = buses.reduce((acc, { bus }) => acc * bus, 1);
    const sum = buses.reduce((acc, { bus, delta }) => {
        const a = absoluteModulo(bus - delta, bus);
        const nU = N / bus;
        const inverse = getInverse(nU, bus);
        // console.log(`x = ${a} (mod ${bus}) ${nU} ${inverse}`);
        return acc + BigInt(BigInt(a) * BigInt(nU) * BigInt(inverse));
    }, 0n);

    return (sum % BigInt(N)).toString();
}

const { part1, part2
    // , run
} = getRunner('./data/day13.txt', calculate, calculate2)

export { part1, part2 }

// run()