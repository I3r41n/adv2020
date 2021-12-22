import { keys, values } from 'lodash'
import  {getRunner} from './core'
const day = 14

type rules = {[key: string]: string[]}


const transform = (s:string, i:number) => 
    0 === i 
    ? s
    : 0 === s.length  
        ? null
        : s.split(' -> ')


const apply_rules = (template: string, rules: rules, steps: number = 10): number[] => {
    const aux = (pairs: {[key: string]: number}, count: {[key: string]: number}, steps: number) => {
        if(steps === 0) return [count, pairs]

        const result = keys(pairs).reduce((acc, pair) => {
            const [element, left, right] = rules[pair]
            const value = pairs[pair]

            count[element] = (count[element] ?? 0) + value
            acc[left] = (acc[left] ?? 0) + value
            acc[right] = (acc[right] ?? 0) + value

            acc[pair] -= value
            return acc
        }, {...pairs})

        return aux(result, count, steps - 1)
    }    
    
    const initial_pairs = 
        Array.from({length: template.length - 1}, (_, i) => i)
            .reduce((acc, cur) => (acc[template.slice(cur, cur+2)] = (acc[template.slice(cur, cur+2)] ?? 0) + 1, acc)
    , {} as {[key: string]: number})

    const initial_count = template
        .split('')
        .reduce((acc, cur) => (acc[cur] = (acc[cur] ?? 0) + 1, acc), {} as {[key: string]: number})
    
    const [count, ] = aux(initial_pairs, initial_count, steps)

    return values(count).sort((a, b) => a - b)
}       

const get_frequencies = async(data: Promise<(string | string[])[]>, steps: number = 10) => {
    const [template, ...rest] = await data

    const rules = rest
        .filter(r => r !== null)
        .reduce((acc, [[l,r], element]) => 
            ({...acc, ...{[`${l}${r}`]: [element, `${l}${element}`, `${element}${r}`]}}), {} as rules)  

    const frequencies = apply_rules(template as string, rules, steps).sort((a, b) => a - b)
    return frequencies[frequencies.length - 1] - frequencies[0]
}

const calculate = async (data: Promise<(string | string[])[]>) => get_frequencies(data, 10)

const calculate2 = async (data: Promise<(string | string[])[]>) => get_frequencies(data, 40)

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, transform)
// run()

export { part1, part2 }