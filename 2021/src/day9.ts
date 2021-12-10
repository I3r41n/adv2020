import { getRunner } from './core'
const day = 9

type location = {x: number, y:number}

const transformLines = (line: string) => line.split('').map(c => +c)

const low_values = (heightmap: number[][]) => heightmap.reduce((acc, row, i, arr1) =>
    acc.concat(row.reduce((points, value, j, arr2) =>
        [
            j > 0 && arr2[j - 1],
            j < arr2.length - 1 && arr2[j + 1],
            i > 0 && heightmap[i - 1][j],
            i < arr1.length - 1 && heightmap[i + 1][j]
        ]
            .filter(i => i > 0 || i === 0)
            .every(v => v > value)
            ? [...points, value]
            : points
        , []))
    , [])

const low_points = (heightmap: number[][]) => heightmap.reduce((acc, row, x, arr1) =>
    acc.concat(row.reduce((points, value, y, arr2) => {
        const neighbors = [
            y > 0 && { x, y: y - 1 } || undefined as location,
            y < arr2.length - 1 && { x, y: y + 1 } || undefined as location, 
            x > 0 && { x: x - 1, y } || undefined as location,
            x < arr1.length - 1 && { x: x + 1, y } || undefined as location
        ]
            .filter(i => i)
        return neighbors.every(({ x, y }) => heightmap[x][y] > value) ? points.concat({ x, y }) : points

    }, [] as location[]))
    , [] as location[])

const basin = (low: location[], heightmap: number[][]) => {
    const maxX = heightmap.length - 1
    const maxY = heightmap[0].length - 1

    const aux = (points: location[], locations:location[]) => {
        console.log(points , locations)
        
        if (points.length === 0) return locations 
        const next_locations = locations.concat(points) 
        const filter_set = new Set(next_locations)   
        const next_points = points.reduce((acc, {x,y}) => { 
            const neighbors = [
                y > 0 && { x, y: y - 1 } || undefined as location,
                y < maxY - 1 && { x, y: y + 1 } || undefined as location, 
                x > 0 && { x: x - 1, y } || undefined as location,
                x < maxX - 1 && { x: x + 1, y } || undefined as location
            ].filter(i => i)
             .filter(l => !filter_set.has(l))
             .filter(({x,y}) => heightmap[x][y] < 9)

            return acc.concat(neighbors)
        }, [] )

        console.log(points, next_points)
        return aux(next_points, next_locations)
    }

    return aux(low, [])
}

const calculate = async (data: Promise<number[][]>) =>
    low_values((await data)).reduce((acc, cur) => acc += cur + 1, 0)

const calculate2 = async (data: Promise<number[][]>) => {
    const heightmap = (await data)
    const basins = basin([low_points(heightmap)[0]], heightmap)

    console.log(basins)

    return 0
}

const { part1, part2
    // ,run
} = getRunner(`./data/day${day}.txt`, calculate, calculate2, transformLines)


// run()

export { part1, part2 }

