import { part1, part2 } from "../src/day8"

describe('what value is in the accumulator?', () => {
    it('return 5', async () => {
        const file = '../test/data/day8/test1'
                
        expect(await part1(file)).toBe(5)
    })
})

describe('What is the value of the accumulator after the program terminates?', () => {
    it('return 8', async () => {
        const file = '../test/data/day8/test1'
                
        expect(await part2(file)).toBe(8)
    })
})