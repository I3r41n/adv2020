import { flatten } from 'lodash'
import { getRunner } from './core'

const getNeighbors = (coord: string, useW: boolean = false) => {
    const { x, y, z, w = 0 } = JSON.parse(coord)
    const dd = [-1, 0, 1]
    const neighbors = [] as string[]

    for (const dx of dd) {
        for (const dy of dd) {
            for (const dz of dd) {
                for (const dw of useW ? dd : [0]) {
                    (dx !== 0 || dy !== 0 || dz !== 0 || dw !== 0) &&
                        neighbors.push(`{"x":${x + dx},"y":${y + dy},"z":${z + dz},"w":${w + dw}}`);
                }
            }
        }
    }

    return neighbors
}

const transform = (line: string, x: number) =>
    line.split('').reduce((acc, cur, y) =>
        cur === '.' ? acc : (acc.push(`{"x":${x},"y":${y},"z":${0},"w":${0}}`), acc), [] as string[])

const cycle: (current: Set<string>, useW?: boolean) => Set<string> = (current, useW = false) => {
    const isActive = (coord: string) => current.has(coord)
    const actives = new Set<string>()
    const toCheck = new Set<string>()

    const changeState = (c: string) => {
        const neighbours = getNeighbors(c, useW)
        const activeNeighbors = neighbours.filter(isActive).length
        const active = activeNeighbors === 3 || (activeNeighbors === 2 && isActive(c))
        active && actives.add(c)
    }
    for (const coord of current) {
        toCheck.add(coord)
        getNeighbors(coord, useW).forEach(n => toCheck.add(n));
    }

    toCheck.forEach(c => changeState(c))

    return actives
}

const runCycle: (initial: string[], rounds?: number, useW?: boolean) => Set<string> = (i, r, w = false) => {
    let actives = new Set<string>(i)
    while (r--) {
        actives = cycle(actives, w)
    }

    return actives
}

const calculate = async (pocketPromise: Promise<string[][]>) => {
    const pocket = flatten(await pocketPromise)

    return runCycle(pocket, 6).size
}

const calculate2 = async (pocketPromise: Promise<string[][]>) => {
    const pocket = flatten(await pocketPromise)

    return runCycle(pocket, 6, true).size
}

const { part1, part2
    // , run
} = getRunner('./data/day17.txt', calculate, calculate2, transform)

export { part1, part2 }

// run()