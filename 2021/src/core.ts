import { readFile } from 'fs'
import { promisify } from 'util'
import { flow, identity, isObject, keys, partialRight } from 'lodash'

const read = async (filename: string) => promisify(readFile)(`${__dirname}/${filename}`, { encoding: 'utf-8' })

const cleanData = async (data: Promise<string>, transformLines: <T>(value: string, idx?: number) => T) =>
    (await data)
        .trim()
        .split('\n')
        .map((s, i) => transformLines(s, i))

const exercise = async (file: string, calculate, parser) => 
    flow([read, partialRight(cleanData, parser), calculate])(file)

const toString = f => isObject(f) ? keys(f).reduce((acc, cur) => acc + ` ${cur}: ${f[cur]} `,'{') + '}': f

export class Runner<X,T> {
    firstExercise: <T>(filename?: string, extra?: number) => Promise<T>
    secondExercise: <T>(filename?: string, extra?: number) => Promise<T>

    constructor(file: string, calculate: (v: Promise<X[]>, extra?:  number) => Promise<T>, calculate2: (v: Promise<X[]>) => Promise<T>, transformLines: (value: string, idx?: number) => X) {      
        this.firstExercise = async (filename: string = file, extra?: number) => exercise(filename, partialRight(calculate, extra), transformLines)
        this.secondExercise = async (filename: string = file, extra?: number) => exercise(filename, partialRight(calculate2, extra), transformLines)
    }

   
    run = async () => {
        const first = await this.firstExercise()
        const second = await this.secondExercise()

        console.log(`results ${toString(first)} ${toString(second)}`)
    }
}

export const getRunner = <X,T>(filename: string, 
        calculate: (v: Promise<X[]>) => Promise<T>, 
        calculate2: (v: Promise<X[]>) => Promise<T>,
        transformLines: (value: string, idx?:number) => X = identity) => {
    const runner = new Runner(filename, calculate, calculate2, transformLines)
    const part1 = async (file: string, extra?: number) => runner.firstExercise(file, extra)
    const part2 = async (file: string, extra?: number) => runner.secondExercise(file, extra)

    return { part1, part2, run: async () => await runner.run() }
}