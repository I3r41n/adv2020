import { part1, part2 } from "../src/day10"

const day = 10
const testSource = `../test/data/day${day}`

describe('What is the total syntax error score for those errors?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(26397)
    })
})

describe('What is the middle score?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(288957)
    })
})
