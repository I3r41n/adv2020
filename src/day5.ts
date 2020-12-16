import { max, partial } from 'lodash'
import  {getRunner} from './core'

type boardingPass = {row: number, column: number, id: number}
const tranform: (v: string) => boardingPass = v => {
    const binaryPartioner =(lowerNumberChar, acc, cur) => {
        const medium = (acc[1] - acc[0] + 1)/2
        return cur === lowerNumberChar ? [acc[0], acc[1] - medium] : [acc[0] + medium, acc[1]]
    }
    const row = (v.slice(0, 7).split('').reduce(partial(binaryPartioner, 'F'), [0, 127]))[0]
    const column = (v.slice(7).split('').reduce(partial(binaryPartioner, 'L'), [0, 7]))[0]

    return ({row, column, id: 8 * row + column})
}

const calculate = async (input: Promise<boardingPass[]>) => {
    const ids = (await input).map(({id}) => id)    
    return max(ids)
}

const calculate2 = async (input: Promise<boardingPass[]>) => {
    const ids = (await input)
        .sort(({id: id0}, {id: id1}) => id0 - id1)
        .map(({id}) => id)
    
    
     return ids.filter((id, idx, arr) => 
         idx > 0 && idx < arr.length - 1 && (id + 1 != arr[idx + 1] || id - 1 != arr[idx - 1]))[0] + 1    
}

const {part1, part2} = getRunner('./data/day5.txt', calculate, calculate2, tranform)

export { part1, part2 }