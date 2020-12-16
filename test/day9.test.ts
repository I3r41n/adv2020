import { part1, part2 } from "../src/day9"

describe('What is the first number that does not have this property?', () => {
    it('return ', async () => {
        const file = '../test/data/day9/test1'
                
        expect(await part1(file, 5)).toBe(127)
    })
})

describe('What is the encryption weakness in your XMAS-encrypted list of numbers?', () => {
    it('return 62', async () => {
        const file = '../test/data/day9/test1'
                
        expect(await part2(file, 5)).toBe(62)
    })
})