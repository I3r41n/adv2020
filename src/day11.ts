import { getRunner } from './core'
import { chain, isEqual, omit, partial } from 'lodash'

type Coord = { row: number, column: number }
type Seat = Coord & { status: 'L' | '#' | '.', adj: Coord[] }

const isSeat = ({ status }: Seat) => '.' !== status
const toCoord = (s: Seat) => omit(s, ['status, adj']) as Coord

const generateWorld: (lobby: Seat[][], getAdjacents: (lobby: Seat[][], coord: Coord) => Coord[]) => Seat[] =
    (l, gA) => l
        .reduce((acc, cur, _, arr) => [...acc,
        ...cur.filter(({ status }) => '.' !== status)
            .map(({ row, status, column }) => ({ row, status, column, adj: gA(arr, { row, column }) }))]
            , [])

const transform: (s: String, idx: number) => Seat[] = (s, idx) =>
    s.split('').map((s, y) => ({ row: idx, column: y, status: s, adj: [] } as unknown as Seat))

const getStatus = (world: Seat[], currentStatus: 'L' | '#' | '.', adj: Coord[], maxTakenAdj: number) => {
    const adjacents: Seat[] = adj.map(({ row, column }) => world.find(s => s.row == row && s.column == column))

    return currentStatus === 'L' && adjacents.every(({ status }) => status === 'L')
        ? '#' : currentStatus === '#' && adjacents.filter(({ status }) => status === '#').length >= maxTakenAdj
            ? 'L' : currentStatus
}

const tick: (current: Seat[], maxTakenAdj: number) => Seat[] = (c, m) =>
    c.map(({ row, column, status, adj }) => ({ row, column, adj, status: getStatus(c, status, adj, m) }))

const calculate: (seatsPromise: Promise<Seat[][]>) => Promise<number> = async seatsPromise => {
    const getAdjacents: (lobby: Seat[][], coord: Coord) => Coord[] = (l, c) => {
        const isAdjacent = ({ row, column }: Coord, { row: rowC, column: columnC }: Seat) =>
            row === rowC && (column + 1 === columnC || column - 1 === columnC) ||
            row + 1 === rowC && (column + 1 === columnC || column - 1 === columnC || column === columnC) ||
            row - 1 === rowC && (column + 1 === columnC || column - 1 === columnC || column === columnC)

        return ([...l[c.row].filter(isSeat).filter(partial(isAdjacent, c)).map(toCoord),
        ...(l[c.row + 1] || []).filter(isSeat).filter(partial(isAdjacent, c)).map(toCoord),
        ...(l[c.row - 1] || []).filter(isSeat).filter(partial(isAdjacent, c)).map(toCoord)])
    }

    const seats = generateWorld(await seatsPromise, getAdjacents)

    const aux = (current: Seat[], previous: Seat[]) => isEqual(current, previous)
        ? current.filter(({ status }) => status === '#').length
        : aux(tick(current, 4), current)

    return aux(tick(seats, 4), seats)
}

const calculate2: (seatsPromise: Promise<Seat[][]>) => Promise<number> = async seatsPromise => {
    const getAdjacents: (lobby: Seat[][], coord: Coord) => Coord[] = (l, c) => {
        const lr = l.reduce((acc, cur) => [...acc, ...cur], [])
            .filter(isSeat)
            .filter(n => c.row != n.row || c.column != n.column)
        
        return [...new Set([
            chain(lr).filter((v) => (v.column > c.column && c.row == v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column > c.column && v.row > c.row && v.column - c.column == v.row - c.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column > c.column && v.row < c.row && v.column - c.column == c.row - v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column < c.column && c.row == v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column < c.column && v.row > c.row && c.column - v.column == v.row - c.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column == c.column && c.row < v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column == c.column && c.row > v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value(),
            chain(lr).filter((v) => (v.column < c.column && v.row < c.row && c.column - v.column == c.row - v.row)).sortBy(({row, column}) => Math.hypot(c.column-column, c.row-row)).head().value()
        ])].filter(i => i).map(toCoord)
    }

    const seats = generateWorld(await seatsPromise, getAdjacents)

    const aux = (current: Seat[], previous: Seat[]) => isEqual(current, previous)
        ? current.filter(({ status }) => status === '#').length
        : aux(tick(current, 5), current)

    return aux(tick(seats, 5), seats)
}

const { part1, part2
    // ,run
} = getRunner('./data/day11.txt', calculate, calculate2, transform)

export { part1, part2 }

// run()