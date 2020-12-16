import { head } from 'lodash'
import { getRunner } from './core'

type Instruction = {
    operation: 'N' | 'S' | 'E' | 'W' | 'L' | 'R' | 'F'
    value: number
}

type Position = {
    E: number,
    S: number,
    W: number,
    N: number,
    Dir: number
}

const transformer: (v: string) => Instruction = v => {
    const a = [...v.matchAll(/(?<operation>N|S|E|W|L|R|F)(?<value>\d+)/g)]

    return {
        operation: head(a)['groups'].operation,
        value: parseInt(head(a)['groups'].value)
    } as Instruction
}

const positions = ["E", "S", "W", "N"]
const newIdx = (pos: number, operation: 'N' | 'S' | 'E' | 'W' | 'L' | 'R' | 'F', value: number) =>
    (4 + (pos + (value / 90 * (operation === 'L' ? -1 : 1)))) % 4

const calculate = async (instPromise: Promise<Instruction[]>) => {
    const getPosition = (cur: Position, { operation, value }: Instruction) => {
        const dir = positions[cur.Dir]
        return ({
            ...cur,
            ...['R', 'L'].includes(operation) &&
            { Dir: newIdx(cur.Dir, operation, value) },
            ...positions.includes(operation) && { [operation]: cur[operation] + value },
            ...operation === 'F' && { [dir]: cur[dir] + value },
        }) as Position
    }

    const instructions = await instPromise

    const finalPosition = instructions.reduce((acc, cur) => (getPosition(acc, cur))
        , { E: 0, S: 0, W: 0, N: 0, Dir: 0 } as Position)

    return Math.abs(finalPosition.N - finalPosition.S) + Math.abs(finalPosition.E - finalPosition.W)
}

const calculate2 = async (instPromise: Promise<Instruction[]>) => {
    const getPositions = ([ship, wayport]: Position[], { operation, value }: Instruction) => {

        return [{
            ...ship,
            ...operation === 'F' && positions.reduce((acc, cur) =>
                ({ ...acc, [cur]: ship[cur] + value * wayport[cur] }), ship)
        },
        {
            ...wayport,
            ...['R', 'L'].includes(operation) && positions.reduce((acc, cur, idx) => {
                const newDir = positions[newIdx(idx, operation, value)]
                return ({ ...acc, [newDir]: wayport[cur] })
            }, wayport),
            ...positions.includes(operation) && { [operation]: wayport[operation] + value }
        }
        ] as Position[]
    }

    const instructions = await instPromise

    const [finalPosition] = instructions.reduce((acc, cur) => (getPositions(acc, cur))
        , [{ E: 0, S: 0, W: 0, N: 0, Dir: 0 }, { E: 10, S: 0, W: 0, N: 1, Dir: 0 }] as Position[])

    return Math.abs(finalPosition.N - finalPosition.S) + Math.abs(finalPosition.E - finalPosition.W)
}



const { part1, part2
    // , run
} = getRunner('./data/day12.txt', calculate, calculate2, transformer)

export { part1, part2 }

// run()
