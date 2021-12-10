import { flatten } from 'lodash'
import  {getRunner} from './core'
const day = 6

const growth = (generation: number[], days: number) => {
    if (0 === days) return generation
    
    const new_gen = generation.map((_f, i, arr) => 8 === i 
        ? arr[0] 
        : 6 === i 
            ? arr[i+1] + arr[0] 
            : arr[i+1])

    return growth(new_gen, days-1)
}


const calculate = async (data: Promise<number[][]>) => {
    const  number_days = 80
    
    const initial = flatten(await data).reduce((acc, cur) => (acc[cur] += 1, acc), Array(9).fill(0))

    return growth(initial, number_days).reduce((acc, cur) => acc + cur , 0)
}

const calculate2 = async (data: Promise<number[][]>) => {
    const number_days = 256

    const initial = flatten(await data).reduce((acc, cur) => (acc[cur] += 1, acc), Array(9).fill(0))
    
    return growth(initial, number_days).reduce((acc, cur) => acc + cur , 0)
}

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, v => v.split(',').map(c => +c))


// run()

export { part1, part2 }

