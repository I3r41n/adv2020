import { getRunner } from './core'

const getNth = (nth: number, initial: number[]) => {
    const game = new Map<number, number>();
     
    initial.forEach((n, i) => game.set(n, i + 1));

    initial.reduce((acc, number, idx) => ({ ...acc, [number]: idx + 1 }), {})
    let play = 0
   
    for (let totalrounds = initial.length + 1 ; totalrounds < nth; totalrounds++) {
        const has = game.get(play)
        game.set(play, totalrounds)
        play = (undefined === has) ? 0 : (totalrounds - has) 
    }

    return play
}

const calculate = async (dataPromise: Promise<number[][]>) => getNth(2020, (await dataPromise)[0])
const calculate2 = async (dataPromise: Promise<number[][]>) => getNth(30000000, (await dataPromise)[0])


const { part1, part2
    // ,run
} = getRunner('./data/day15.txt', calculate, calculate2, (s: string) => s.split(',').map(s => parseInt(s)))

export { part1, part2 }

// run()