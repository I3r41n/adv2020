import { part1, part2 } from "../src/day19"

describe('How many messages completely match rule 0?', () => {
    it('return 2', async () => {
        const file = '../test/data/day19/test1'
                
        expect(await part1(file)).toBe(2)
    })
})

describe('After updating rules 8 and 11, how many messages completely match rule 0?', () => {
    it('return 12', async () => {
        const file = '../test/data/day19/test2'
                
        expect(await part2(file)).toBe(12)
    })
})