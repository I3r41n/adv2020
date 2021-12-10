import { part1, part2 } from "../src/day8"

const day = 8
const testSource = `../test/data/day${day}`

describe('In the output values, how many times do digits 1, 4, 7, or 8 appear?', () => {
    it('return 26', async () => {
        const file = `${testSource}/test2`
                
        expect(await part1(file)).toBe(26)
    })
})

describe('What do you get if you add up all of the output values?', () => {
    it('return 16', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(5353)
    })
    it('return 61229', async () => {
        const file = `${testSource}/test2`
                
        expect(await part2(file)).toBe(61229)
    })
})