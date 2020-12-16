import { head } from 'lodash'
import  {getRunner} from './core'

type Op = {
    operation: 'acc' | 'jmp' | 'nop'
    value: number
    run: boolean
}

const transformer:(v: string) => Op = v => {
    const a =  [...v.matchAll(/(?<operation>acc|jmp|nop) (?<value>(-|\+)\d+)/g)]
    
    return {
         operation: head(a)['groups'].operation,
         value: parseInt(head(a)['groups'].value), 
         run: false} as Op
}

const calculate = async (code: Promise<Op[]>) => {
    const run = (program : Op[], inst: number=0, acc=0, previousAcc=0) => {
        const op = program[inst]
        return op.run ? previousAcc
        : run (
            [...program.slice(0, inst), {...op, run: true}, ...program.slice(inst + 1)],
            inst + (op.operation === 'jmp' ? op.value : 1), 
            acc + (op.operation === 'acc' ? op.value : 0 ),
            acc)
    }    
    return run(await code)
}

const calculate2 = async (originalPromise: Promise<Op[]>) => {
    const original = await originalPromise
    const run = (program : Op[], inst: number=0, acc=0) => {
        const op = inst == program.length ? null : program[inst]
        return !op  ? acc : op.run 
                    ? -1 : run (
            [...program.slice(0, inst), {...op, run: true}, ...program.slice(inst + 1)],
            inst + (op.operation === 'jmp' ? op.value : 1), 
            acc + (op.operation === 'acc' ? op.value : 0 ))
    }    

    const testRuns = (code: Op[] = original, inst: number = 0) => {
        const changeOp = (inst: number) => {
            const op = original[inst]
            return [...original.slice(0, inst), 
                {...op, operation: op.operation === 'jmp' ? 'nop': 'jmp'} as Op, 
                ...original.slice(inst + 1)]
        }

        const result = code[inst].operation !== 'acc' ? run(changeOp(inst)) : -1
        return -1 == result 
            ? testRuns(code, inst + 1)
            : result 
    }

    return testRuns()
}

const {part1, part2} = getRunner('./data/day8.txt', calculate, calculate2, transformer)

export { part1, part2 }