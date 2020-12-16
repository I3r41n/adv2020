import { partial } from 'lodash'
import  {getRunner} from './core'

type item = {x: number , y: number , tree?: boolean}
const cleaner:(s: string, y?: number)=> item[] = (s, y) => s
    .split('')
    .map((c, x) => ({x , y, tree: c == '#'}))
    

const calculateForSlope = async ({x: x0, y:y0}: item, geoPromise: Promise<item[][]>) => {
    const geo = await geoPromise
    const patternSize = geo[0].length

    const treePositions = geo
        .map(items => items.filter(({tree}) => tree))
        .filter((_, idx) => 0 === idx % y0)
    
    return treePositions.reduce(
        (acc, cur, i) => {
            acc[i] = cur.some(({x}) => x === (x0 * i)%patternSize)
            return acc
        }, new Array<boolean>(patternSize).fill(false)).filter(v => v).length
}   

const calculate = partial(calculateForSlope, {x:3 ,y:1} as item)
const calculate2 = async (geoPromise: Promise<item[][]>) => {
    const slopes: item[] = [{x:1, y:1},{x:3, y:1},{x:5, y:1},{x:7, y:1},{x:1, y:2}] 

    return slopes.reduce(async (acc, cur) => {
        const trees = await calculateForSlope(cur, geoPromise)
        return Promise.resolve( trees * await acc)}, Promise.resolve(1))
}

const {part1, part2} = getRunner('./data/day3.txt', calculate, calculate2, cleaner)

export { part1, part2 }