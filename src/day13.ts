import  {getRunner} from './core'

const calculate = async (_: Promise<any[]>) => await Promise.resolve(0)

const {part1, part2
    //,run
    } = getRunner('./data/day13.txt', calculate, calculate)

export { part1, part2 }

//run()