import  {getRunner} from './core'
import { chunk, drop, flow, isEmpty, keys, omitBy, partialRight, toPairs } from 'lodash'

type Bag = Record<string, Record<string, number>>
const transformer: (s: string)=> Bag = s => {
    const regex = /([a-zA-Z ]+) bags contain (([\d]+|no) ([a-zA-Z ]+) bags?)(, ([\d]+) ([a-zA-Z ]+) bags?)?(, ([\d]+) ([a-zA-Z ]+) bags?)?(, ([\d]+) ([a-zA-Z ]+) bags?)?./g
    const matches = [...s.matchAll(regex)]
    return  matches.reduce((acc, cur) => {
        const name = cur[1]
        const a = flow([partialRight(drop, 2), partialRight(chunk, 3)])(cur)
       
        return {...acc, [name]: a.reduce((acc, [,qt, name]) => 
            ((undefined === name || 'other' === name) && acc || 
                {...acc, [name]: (qt == 'no' ? 0 : parseInt(qt))}), {})}
    }, {})
} 


const calculate = async (bags: Promise<Bag[]>) => {
    const luggage =  omitBy( (await bags).reduce((acc, cur) => ({...acc, ...cur}), {}),isEmpty)
    
    const aux = (lookups: Set<string>, counted: Set<string> = new Set<string>()) => {
        const getNewLookups = () => {
            const toCheck = new Set([...lookups].filter(x => !counted.has(x)))           
            return new Set(keys(luggage).filter(k => (keys(luggage[k]).some(c => toCheck.has(c)))))
        }
        
        return 0 === lookups.size 
            ? counted.size - 1 
            : aux(getNewLookups() , new Set([...lookups, ...counted]))
    }

    return aux(new Set(['shiny gold']))
}

const calculate2 = async (bags: Promise<Bag[]>) => {
    const bag = 'shiny gold'
    const luggage =  omitBy( (await bags).reduce((acc, cur) => ({...acc, ...cur}), {}),isEmpty)
    
    const aux = (parent: string) => luggage[parent]  
        ? 1 + toPairs(luggage[parent])
                .map(([k, qt]) => (qt as number) * aux(k))
                .reduce((sum, v) => v + sum , 0)
        : 1
            
    return aux(bag) - 1
}


const {part1, part2} = getRunner('./data/day7.txt', calculate, calculate2, transformer)

export { part1, part2 }