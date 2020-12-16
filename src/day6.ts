import { keys } from 'lodash'
import  {getRunner} from './core'

const calculate = async (v: Promise<string[]>) => {
    const transformer: (s:string) => Set<string> = (s) => new Set(s.split(''))

    const distinctAnswers = (await v).map(transformer).reduce((acc, cur) => cur.size === 0 
        ? (acc.push(new Set()), acc)
        : (acc.push(new Set([...acc.pop(), ...cur])), acc)
    , [new Set<string>()])  
    
    
    return distinctAnswers.reduce((acc, cur) => acc + cur.size, 0)
}

type Occurency = Record<string, number>
const calculate2 = async (v: Promise<string[]>) => {
    const countAnswers = (occ: Occurency) => keys(occ).reduce(
        (acc, cur) => acc + (occ[cur] === occ['answers'] ? 1 : 0), -1)
    const updateOccurency = (occ: Occurency, c: string) => 
        c.split('').reduce((acc, cur) => ({...acc, ...{[cur]: (acc[cur] || 0) + 1}} ), 
        {...occ, answers: occ['answers'] + 1})
    const distinctAnswers = (await v).reduce((acc, cur) => 
        cur.length === 0 
            ? (acc.push({answers: 0}), acc)
            : (acc.push(updateOccurency(acc.pop(), cur)), acc)
    , [{answers: 0} as Occurency])  
    
    return distinctAnswers.map(occ => countAnswers(occ)).reduce((acc, cur) => acc + cur, 0)
}

const {part1, part2 } = getRunner('./data/day6.txt', calculate, calculate2)

export { part1, part2 }

// run()