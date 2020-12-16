import {getRunner} from './core'

const calculate = async (data: Promise<number[]>) => {
    let res: number;
    (await data).reduce((acc, cur) => {
        res = acc[cur] ? cur * acc[cur] : res
        acc[2020 - cur] = cur
        return acc
    }, {})
    return res
}

type pair = {first: number, second: number, rem: number}
const calculate2 = async (data: Promise<number[]>) => {
    const values = await data

    const unique_pairs = [...values.reduce((acc, cur) => {
        const cur_pairs = values
            .map(v => {
                const [first, second] =  cur < v ? [cur, v]: [v, cur]
                return { first, second, rem: 2020 - first - second }})
            .filter(({rem}) => rem > 0)
        acc = new Set([...acc, ...cur_pairs])
        return acc
    }, new Set<pair>())]
    .reduce((acc, cur) => (acc[cur.rem] = cur, acc), {})
   
    return values.reduce((acc, cur) => 
        unique_pairs[cur] ? cur * unique_pairs[cur].first * unique_pairs[cur].second: acc
    , null)
}

const cleaner = (a:string) => parseInt(a)
const { part1, part2 } = getRunner('./data/day1.txt', calculate,calculate2, cleaner)

export { part1, part2 }

