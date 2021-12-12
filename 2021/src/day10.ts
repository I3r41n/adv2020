import  {getRunner} from './core'
const day = 10

const open = ['(','[','{','<']
const close = [')',']','}','>']

const reverse = (c: string) => close[open.indexOf(c)]
    
const evaluate = (l:string[]) => {
    const aux = (l:string[], expected: string[] = []) => {
       if (l.length == 0) return expected.length == 0 
        ? 'V' 
        : expected.reverse()

       const got = l[0]
       const wanted = reverse(got)
       const wished = expected.pop()

       if(close.includes(got)) {
            if(got !== wished) return got
       } else {
        wished && expected.push(wished)   
        expected.push(wanted)
       }    
    
       return aux(l.splice(1), expected)
    }
    return aux(l)
}

const calculate = async (data: Promise<string[][]>) => {
    const value = [3, 57, 1197, 25137]

    return (await data)
        .map(evaluate)
        .filter(c => close.includes(c))
        .reduce((acc, cur) => acc += value[close.indexOf(cur)], 0)
}

const calculate2 = async (data: Promise<string[][]>) => {
    const value = [1,2, 3, 4]
    const middle_idx = arr => Math.floor(arr.length / 2) 

    const scores = (await data)
        .map(evaluate)
        .filter(c => !(close.includes(c) || c === 'V'))
        .map(e => e.reduce((acc, cur) => acc*5 + value[close.indexOf(cur)],0))
    return scores.sort((a,b) => a - b)[middle_idx(scores)]
}
    

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2,  v => v.split(''))

// run()

export { part1, part2 }

