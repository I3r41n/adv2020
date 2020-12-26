import { getRunner } from './core'
import { concat, drop, flatten, flow, keys, partialRight, take, takeWhile, values, zip } from 'lodash'


const ruleRegex = /(?<rule>[^:]+): (?<range1start>[\d]+)-(?<range1end>[\d]+) or (?<range2start>[\d]+)-(?<range2end>[\d]+)/g
const transform = (data: string[]) => {
    const rules: Record<string, [number, number][]> = takeWhile(data, s => !!s.length)
        .reduce((acc, cur) => {
            const { groups } = [...cur.matchAll(ruleRegex)][0]

            return {
                ...acc, ...{
                    [groups.rule]: [[Number(groups.range1start), Number(groups.range1end)],
                    [Number(groups.range2start), Number(groups.range2end)]]
                }
            } as Record<string, [number, number][]>
        }, {} as Record<string, [number, number][]>)

    const own = take(drop(data, keys(rules).length + 2), 1).map(s => s.split(',').map(c => Number(c.trim())))

    const tickets = drop(data, keys(rules).length + 5).map(s => s.split(',').map(c => Number(c.trim())))

    return { rules, own: flatten(own), tickets }
}

const acceptedRanges = (rules: Record<string, [number, number][]>) => values(rules).reduce((acc, [first, second]) => {
    const insertInterval: (intervals: Record<number, number>, interval: [number, number]) => Record<number, number> =
        (intervals, [s, e]) => ({ ...intervals, ...{ [e]: (intervals[e] || s) < s ? intervals[e] : s } })

    return flow(partialRight(insertInterval, first), partialRight(insertInterval, second))(acc)
}
    , {} as Record<number, number>)

const getRange = (n: number, ranges) => keys(ranges).map(k => parseInt(k, 10)).some(k => n <= k && n >= ranges[k])

const calculate = async (dataPromise: Promise<string[]>) => {
    const { rules, tickets } = transform(await dataPromise)

    const ranges = acceptedRanges(rules)

    return flatten(tickets).filter(n => !getRange(n, ranges)).reduce((acc, cur) => acc + cur, 0)
}

const intersception = (a:Set<string>, b:Set<string>) => new Set([...a].filter(x => b.has(x)));
const difference = (a:Set<string>, b:Set<string>) => new Set([...a].filter(x => !b.has(x)))

const calculate2 = async (dataPromise: Promise<string[]>) => {
    const { rules, tickets, own } = transform(await dataPromise)

    const aux: (fields: Set<string>[], counter?: number) => string[] = (fields, counter = 0) => {
        const defined = new Set<string>(fields.filter((f) => f.size === 1).reduce((acc, cur)=> [...acc, ...cur] ,[] ))

        return (defined.size === fields.length || counter === 10) 
            ? fields.map(s => [...s][0] )
            : aux(fields.map(f => f.size > 1 && difference(f, defined) || f))
    }

    const ranges = acceptedRanges(rules)

    const validTickets = tickets.filter(t => flatten(t).reduce((acc, cur) => acc && !!getRange(cur, ranges), true))

    const valuesByPosition = zip(...concat([own], validTickets)).map(i => new Set(i))

    const getPossibleFields = (n: Set<number>) => [...n].reduce((acc, cur, idx) => {
        const nRules = keys(rules).reduce((a, r) => 
            rules[r].some(([s,e]) => s <= cur && cur <= e)
            ? a.add(r)
            : a
            ,new Set<keyof typeof rules>())
        return idx ? intersception(acc, nRules) : nRules
    }, new Set<keyof typeof rules>())
    
    const fields = valuesByPosition.reduce((acc, cur) => [...acc, getPossibleFields(cur)], [] as Set<string>[])

    const correctedTicket = aux(fields).reduce((acc, cur, idx) => ({...acc, [cur]: own[idx]}), {})

    // const solution = keys(correctedTicket).filter(k => k.startsWith('departure')).reduce((acc, cur) => acc * correctedTicket[cur], 1)
    // solution && console.log(keys(correctedTicket) ,solution)

    return correctedTicket
}

const { part1, part2
    // , run
} = getRunner('./data/day16.txt', calculate, calculate2)

export { part1, part2 }

// run()