import { flatten, max, min } from 'lodash'
import  {getRunner} from './core'
const day = 7

const calculate = async (data: Promise<number[][]>) => {
    const crabs_initial = flatten(await data)
    
    const calculate_fuel = (pos:number, total: number = Number.MAX_SAFE_INTEGER) => {
        if(pos < 0) return total
        
        const cost = crabs_initial.reduce((acc, cur) => acc+=Math.abs(pos - cur), 0)
        return calculate_fuel(pos-1, min([cost, total]))
     }
    

    return calculate_fuel(max(crabs_initial))
}

const calculate2 = async (data: Promise<number[][]>) => {
    const crabs_initial = flatten(await data)
    const steps = [...Array(max(crabs_initial) + 1).keys()]
        .reduce((acc, cur, i) => (acc.push(cur + (cur > 0 ? acc[i -1] : 0)), acc),[])
    

    const calculate_fuel = (pos:number, total: number = Number.MAX_SAFE_INTEGER) => {
        if(pos < 0) return total
        
        const cost = crabs_initial.reduce((acc, cur) => acc += steps[Math.abs(pos - cur)], 0)
        
        return calculate_fuel(pos-1, min([cost, total]))
     }
    

    return calculate_fuel(max(crabs_initial))
}

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, v => v.split(',').map(c => +c))


// run()

export { part1, part2 }

