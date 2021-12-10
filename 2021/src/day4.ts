import { concat, dropRight, last, sum, takeRight } from 'lodash'
import { getRunner } from './core'

type draw = number[]
type board = {
    all: Set<number>,
    rows: Set<number>[]
    columns: Set<number>[]
    unmarked: number[]
    marked: number[]
}


const transformLines = (value: string, idx?: number): number[] => {
    const separator = idx == 0 ? ',' : ' '

    return value.split(separator).filter(c => ![' ', ''].includes(c)).map(v => v == '' ? null : parseInt(v))
}

const calculate = async (input: Promise<number[][]>) => {
    const data = await input
    const numbers = data[0] as draw

    const boards = get_boards(data)

    var game = boards

    const winner = numbers.reduce((acc, cur) => {
        if (!!acc) return acc

        game = play(game, cur)
        return game.reduce((acc, cur) =>
            cur.rows.some(r => isSubset(r, new Set(cur.marked))) || cur.columns.some(c => isSubset(c, new Set(cur.marked))) 
                ? cur 
                : acc
            , null)
    }
        , null) as board

    return sum([...winner.unmarked]) * takeRight(winner.marked)[0]
}

const calculate2 = async (input: Promise<number[][]>) => {
    const data = await input
    const numbers = data[0] as draw

    const boards = get_boards(data)

    var game = boards

    const winners = numbers.reduce((acc, cur) => {
        game = play(game, cur)

        const possible_winners = game.reduce((winners, cand) =>
        cand.rows.some(r => isSubset(r, new Set(cand.marked))) || cand.columns.some(c => isSubset(c, new Set(cand.marked))) 
                ? [...winners, cand] 
                : winners
        , [])

        if (possible_winners.length) {
            acc = [...acc, ...possible_winners]
            game = possible_winners.reduce((acc, cur) => 
                acc.filter(({ all }) => all !== cur.all), 
                game
            )
        }

        return acc
    }, [] as board[])

    const last_winner = takeRight(winners)[0]
    return sum([...last_winner.unmarked]) * takeRight(last_winner.marked)[0]
}

const get_boards = (data: number[][]) => data.filter((_, i) => i > 0).reduce((acc, cur) => {
    if (!cur.length) return [...acc, {
        all: new Set<number>(),
        rows: [],
        columns: Array.from({ length: 5 }, () => new Set<number>()),
        unmarked: [],
        marked: []
    }]

    const b = last(acc)

    return concat(dropRight(acc), {
        ...b,
        all: new Set<number>([...b.all, ...cur]),
        rows: [...b.rows, new Set(cur)],
        columns: b.columns.map((s, i) => s.add(cur[i])),
        unmarked: [...b.unmarked, ...cur],
    })
}, [] as board[])

const equalSets = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

const isSubset = (set: Set<number>, superSet: Set<number>) => {
    const intersection = new Set([...superSet].filter(x => set.has(x)))
    return equalSets(intersection, set)
}



const play = (boards: board[], num: number) =>
    boards.map(b => ({
        ...b,
        ...b.all.has(num) && { marked: [...b.marked, num] },
        ...b.all.has(num) && { unmarked: [...b.unmarked].filter(v => v !== num) }
    }))

const { part1, part2
    // , ruz`n
} = getRunner<number[], number>('./data/day4.txt', calculate, calculate2, transformLines)


// run()

export { part1, part2 }