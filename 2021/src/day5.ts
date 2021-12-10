import { flatten, max } from 'lodash'
import  {getRunner} from './core'
const day = 5
 
type coord = {x: number, y: number, id: string}

const transformLines = (value: string, _idx?:number): coord[] => {
    const regex = /(\d*),(\d*) -> (\d*),(\d*)/
    const [,x1,y1,x2,y2] = value.match(regex)
    
    return [{x: +x1, y: +y1, id: `x${+x1}-y${+y1}`}, {x: +x2, y: +y2, id: `x${+x2}-y${+y2}`}]     
}

const calculateLine = ({x:x1, y:y1}, {x:x2, y:y2}) => {
    const nextX = x1 === x2 ? _idx => x1 : x1 > x2 ? idx => x1 - idx : idx => x1 + idx
    const nextY = y1 === y2 ? _idx => y1 : y1 > y2 ? idx => y1 - idx : idx => y1 + idx

    const length = max([Math.abs(x1-x2), Math.abs(y1-y2)]) + 1
    
    return Array.from({length}, (_, idx) => {
        const x = nextX(idx)
        const y = nextY(idx)
        return {x, y,id: `x${x}-y${y}`}
    })
}

const calculateFrequencies = (coords: coord[][]) => {
    const lines = coords.reduce((acc, [c1, c2]) => [...acc, calculateLine(c1, c2)], [] as coord[][])
    
    return flatten(lines).
        reduce((acc, cur) => acc.set(cur.id, (acc.get(cur.id) || 0) + 1)
            , new Map<string, number>())
}

const getOverlappingPoints = (frequencies: Map<string, number>) => 
    Array.from(frequencies, ([_,v]) => v).filter(v => v > 1).length

const calculate = async (data: Promise<coord[][]>) => {
    const noDiagonalLinesFilter = ([p1, p2]) => p1.x === p2.x || p1.y === p2.y
    const coords = (await data).filter(noDiagonalLinesFilter)
  
    return getOverlappingPoints(calculateFrequencies(coords))
}

const calculate2 = async (data: Promise<coord[][]>) => {
    const coords = (await data)
  
    return getOverlappingPoints(calculateFrequencies(coords))
}


const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, transformLines)


// run()

export { part1, part2 }

