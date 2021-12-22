import { max } from 'lodash'
import  {getRunner} from './core'
const day = 13

type fold = {coord: 'x'|'y', value: number}
type coord = {x: number, y: number}

const isFold = (variableToCheck: any): variableToCheck is fold =>
  ['x', 'y'].includes((variableToCheck as fold).coord)

const sentence = 'fold along '
const transform = (s:string) => s.startsWith(sentence)
    ? s.substring(sentence.length).split("=").reduce((acc, cur, idx) => ({
        ...acc, 
            ...(idx === 0 && {coord: cur}),
            ...(idx === 1 && {value: +cur})}), {} as fold)
    : s.split(',').reduce((acc, cur, idx) => ({...acc, 
        ...(idx === 0 && {x: parseInt(cur)}),
        ...(idx === 1 && {y: parseInt(cur)})}), {} as coord)


const apply_fold = (matrix: Set<string>, folds: fold[]) => {
    return folds.reduce((acc, {coord, value}) => 
        new Set( [...acc]
            .map(c => JSON.parse(c))
            .map((c) => JSON.stringify(c[coord] > value? {...c , [coord]: (c[coord] - value) * -1 + value} : c)))
    , matrix)   
    }

const calculate = async (instructions: Promise<(fold|coord)[]>) => {
    const data = (await instructions)
    const matrix = new Set(data.filter(c => !isFold (c))
        .map(c => JSON.stringify(c)))
    const folds = data.filter(c => isFold (c)) as any as fold[]
    
    const folded = apply_fold(matrix, [folds[0]])

    return folded.size
}
        
const print = (matrix: Set<string>, folds: fold[]) => {
    const folded = [...apply_fold(matrix, folds)].map(c => JSON.parse(c))

    const empty_paper = Array.from({length: max(folded.map(({x}) => x)) + 1}, 
        () =>  Array.from({length: max(folded.map(({y}) => y)) + 1}, () => ' '))
    
    const code = folded
        .reduce((acc, {x,y}) => (acc[x][y] = '%', acc), empty_paper)
        .reduce((m, r) =>  m+= r.reduce((n, c) => n += c) + "\n", "\n")  

    console.log(code) 
}

const calculate2 = async (instructions: Promise<(fold|coord)[]>) => {
    const data = (await instructions)
    const matrix = new Set(data.filter(c => !isFold (c))
        .map(c => JSON.stringify(c)))
    const folds = data.filter(c => isFold (c)) as any as fold[]
    
    print(matrix, folds)

    return 0
}
        

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, transform)

// run()

export { part1, part2 }

