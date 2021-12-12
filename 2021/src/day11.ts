import { flatten } from 'lodash'
import { getRunner } from './core'
const day = 11

type coords = {
    x: number;
    y: number;
}

type oct = coords & {
    energy: number;
    neighbors: coords[];
}

const neighbors = (map: number[][], x: number, y: number) => {
    const maxX = map.length - 1
    const maxY = map[0].length - 1

    return [
        y > 0 && { x, y: y - 1 } || undefined as coords,
        y > 0 && x > 0 && { x: x - 1, y: y - 1 } || undefined as coords,
        y < maxY && { x, y: y + 1 } || undefined as coords,
        y < maxY && x < maxX && { x: x + 1, y: y + 1 } || undefined as coords,
        x > 0 && { x: x - 1, y } || undefined as coords,
        x > 0 && y < maxY && { x: x - 1, y: y + 1 } || undefined as coords,
        x < maxX && { x: x + 1, y } || undefined as coords,
        x < maxX && y > 0 && { x: x + 1, y: y - 1 } || undefined as coords
    ].filter(i => i)
}

const flash = (state: oct[]) => {
    const flashable = state.filter(({ energy }) => energy > 9)
    const total_flashes = flashable.length

    if (!total_flashes) return state

    const next = state.reduce((acc, cur, idx) =>
        flashable.includes(cur)
            ? (acc[idx] = { ...cur, energy: 0 },
                cur.neighbors.forEach(n => {
                    const idx = state.findIndex(({ x, y }) => x === n.x && y === n.y)
                    const state_n = state[idx]
                    if (state_n.energy) acc[idx] = { ...state_n, energy: state_n.energy + 1 }
                }),
                acc)
            : acc
        , state as oct[])

    return flash(next)
}

const calculate = async (data: Promise<number[][]>) => {
    const days_to_simulate = 100
    
    const aux = (state: oct[], days: number, total: number = 0) => {

        if (!days) return total
    
        const energy_update = state.map(o => ({ ...o, energy: 1 + o.energy } as oct))
    
        const new_state = flash(energy_update)
    
        return aux(new_state, days - 1, total += new_state.filter(({ energy }) => energy === 0).length)
    }

    const grid = (await data)
    const octupus = flatten(grid
        .map((row, x) => row
            .map((energy, y) => ({
                x,
                y,
                energy: energy,
                neighbors: neighbors(grid, x, y)
            } as oct))))

    return aux(octupus, days_to_simulate)
}

const calculate2 = async (data: Promise<number[][]>) => {
    const grid = (await data)
    
    const aux = (state: oct[], days: number = 0) => {

        if (state.filter(({energy}) => energy > 0).length === 0) return days
    
        const energy_update = state.map(o => ({ ...o, energy: 1 + o.energy } as oct))
    
        const new_state = flash(energy_update)
    
        return aux(new_state, days + 1)
    }

    const octupus = flatten(grid
        .map((row, x) => row
            .map((energy, y) => ({
                x,
                y,
                energy: energy,
                neighbors: neighbors(grid, x, y)
            } as oct))))

    return aux(octupus)
}


const { part1, part2
    // , run
} = getRunner(`./data/day${day}.txt`, calculate, calculate2, v => v.split('').map(c => +c))


// run()

export { part1, part2 }

