import {getRunner} from './core'

const calculateIncreases = (acc, cur, idx, arr) => 
    idx === 0 || cur <= arr[idx - 1] ? acc : acc + 1

const slidingWindows = (acc, cur, idx, arr) => 
    idx > arr.length - 3 ? acc : [...acc, cur + arr[idx + 1] + arr[idx + 2] ]

const calculate = async (data: Promise<number[]>) => 
     (await data).reduce(calculateIncreases, 0)    

const calculate2 = async (data: Promise<number[]>) => 
    (await data).reduce(slidingWindows, []).reduce(calculateIncreases, 0)


const cleaner = (a:string) => parseInt(a)
const { part1, part2 } = getRunner('./data/day1.txt', calculate, calculate2, cleaner)

// run()

export { part1, part2 }



