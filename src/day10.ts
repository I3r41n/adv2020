import { drop } from 'lodash'
import  {getRunner} from './core'

const calculate = async (adaptersPromise: Promise<number[]>) =>{
    const adapters = (await adaptersPromise).sort((n1,n2) => n1 - n2)
    const differences = adapters.map((v, idx, arr) => idx == 0 ? v : v - arr[idx-1])
    
    return differences.filter(d => d == 1).length * 
     (differences.filter(d => d == 3).length + 1)
}
    
const calculate2 = async (adaptersPromise: Promise<number[]>) =>{
    const adapters = (await adaptersPromise).sort((n1,n2) => n1 - n2)
    const differences = adapters.map((v, idx, arr) => idx == 0 ? v : v - arr[idx-1])
    
    const multiplier = [1,1,2,4,7,13]

    const combinationOf1 = (subject :number[], totalOnes: number = 0, combination: number = 1 ) => {
        const current = subject.length && subject[0] 
        const isOne = 1 === current
        
        return current 
            ? combinationOf1 (drop(subject, 1), 
                              isOne? 1 + totalOnes : 0, 
                              isOne? combination : combination * multiplier[totalOnes])
            : combination * multiplier[totalOnes]
    }

    return combinationOf1(differences)
}

const {part1, part2
    // ,run
    } = getRunner('./data/day10.txt', calculate, calculate2, (a:string) => parseInt(a))

export { part1, part2 }

// run()   