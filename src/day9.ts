import { drop, intersectionWith, isEqual, reverse, take } from 'lodash'
import  {getRunner} from './core'

const calculate = async (codePromise: Promise<number[]>, preambleLenght: number = 25) => {
    const code = await codePromise
    const isSum = (subject: number, candidates: number[]) => {
        const missing   = candidates.map(c => subject - c )
 
        return intersectionWith(candidates, missing, isEqual).length !== 0
    }

    const findNumber = (data: number[], preamble: number[]) => {
        const subject =  data[0]
        return isSum(subject, preamble) 
            ? findNumber(drop(data, 1), [...drop(preamble, 1), subject])
            : subject
    }

    return findNumber(drop(code,preambleLenght), take(code,preambleLenght))
}


const calculate2 = async (codePromise: Promise<number[]>, preambleLenght: number = 25) => {
    const code = await codePromise
    const total = await calculate(codePromise, preambleLenght)

    const getRange = (initial: number = 0, end: number = 2 ) => {
        const range = code.slice(initial, end)
        const rangeSum = range.reduce((acc, cur )=> acc + cur, 0)
        
        return rangeSum === total 
            ? range
            : getRange(rangeSum > total ? initial + 1 : initial,
                rangeSum < total ? end + 1 : end)
    }

    const range = getRange().sort()   
    return range[0] + reverse(range)[0]
}


const {part1, part2,
    //  run
    } = getRunner('./data/day9.txt', calculate, calculate2, (a:string) => parseInt(a))

export { part1, part2 }

// run()