import { getRunner } from './core'

const transform = (s: string) => s.split(' ').join('')

const innerFormula = /\([^(|)]*\)/

const calc = ( term: string) => {
    const termParts = term.replace(/\(|\)/g, '').split(/\+|\*/)
   
    return term.indexOf('*') > -1
        ? Number(termParts[0]) * Number(termParts[1])
        : Number(termParts[0]) + Number(termParts[1])
}

const calculate = async (formulasPromise: Promise<string[]>) => {
    const formulas = (await formulasPromise)

    const aux = (formula: string) => {      
        const  parents = formula.match(innerFormula)
        
        const s: string =  (parents 
                    && `${formula.slice(0, parents.index)}${aux(parents[0].replace(/\(|\)/g, ''))}${formula.slice(parents.index + parents[0].length)}`)
                    || formula
       
        const next = s.match(/[\d]+[\*|\+][\d]+/) 
        return !next
            ? s
            : aux(s.indexOf('(')  > - 1 ? s : `${calc(next[0])}${s.slice(next[0].length)}`)
    }

   return formulas.map(f => aux(f)).reduce((acc, cur) => Number(cur) + acc, 0)
}

const calculate2 = async (formulasPromise: Promise<string[]>) => {
    const formulas = (await formulasPromise)

    const aux = (formula: string) => {      
        const parents = formula.match(innerFormula)
        const s: string =  (parents 
                    && `${formula.slice(0, parents.index)}${aux(parents[0].replace(/\(|\)/g, ''))}${formula.slice(parents.index + parents[0].length)}`)
                    || formula
       
        const next = s.match(/[\d]+[\+][\d]+/) || s.match(/[\d]+[\*][\d]+/) 

        return !next
            ? s
            : aux(s.indexOf('(')  > - 1 ? s : `${s.slice(0, next.index)}${calc(next[0])}${s.slice(next.index + next[0].length)}`)
    }

   return formulas.map(f => aux(f)).reduce((acc, cur) => Number(cur) + acc, 0)
}

const { part1, part2
    // ,run
} = getRunner('./data/day18.txt', calculate, calculate2, transform)

export { part1, part2 }

// run()