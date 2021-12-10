import  {getRunner} from './core'

type report = Array<number>

const transformLines = (value: string, _idx?: number): report  => 
    Array.from(value).map(c => +c)
 
const binaryArrayToDec = arr => parseInt(arr.join(''), 2)

const transpose = matrix => 
    matrix.reduce((acc, cur) => cur.map((item, i) =>
      (acc[i] || []).concat(item)), [])
  
const calculate = async (data: Promise<report[]>) => {
    const matrix = transpose(await data)

    const reducedMatrix = matrix.map(m => ({
        zeros: m.filter(c => c === 0).length,
        ones:  m.filter(c => c === 1).length
    }))    

    const gamma = reducedMatrix.map(({zeros, ones}) => zeros > ones ? 0 : 1)
    
    const epsilon = gamma.map(v => v ^= 1)
        
    return binaryArrayToDec(gamma) * binaryArrayToDec(epsilon)
}
 
const calculate2 = async (data: Promise<report[]>) => {
    const matrix = (await data)
    const allCandidates = matrix.map((_, i) => i)

    const aux = (op, candidates = allCandidates, idx = 0) => {
        if (candidates.length ==  1) return matrix[candidates[0]]
    
        const {zeros, ones} = candidates.reduce(
            (acc, cur) => matrix[cur][idx] == 0 
                ? {...acc, zeros: [...acc.zeros, cur] }
                : {...acc, ones: [...acc.ones, cur] }, 
           {zeros: [], ones: []})    
        
         return aux(op, op(zeros, ones), idx + 1)  
    }   
    
    const oxygOp = (z, o) => o.length >= z.length ? o : z
    const co2Op = (z, o) => z.length <=  o.length ? z : o

    const oxygenGeneratorRating = aux(oxygOp)   
    const CO2ScrubberRating = aux(co2Op)   
    
    return binaryArrayToDec(oxygenGeneratorRating) * binaryArrayToDec(CO2ScrubberRating)
}

const {part1, part2
    // ,run
    } = getRunner('./data/day3.txt', calculate, calculate2, transformLines)


    export { part1, part2 }

    // run()
