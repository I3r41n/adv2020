import { part1, part2 } from "../src/day14"

describe('What is the sum of all values left in memory after it completes?', () => {
    it('return 165', async () => {
        const file = '../test/data/day14/test1'
                
        expect(await part1(file)).toBe(165)
    })
})

describe('What is the sum of all values left in memory after it completes?', () => {
    it('return 208', async () => {
        const file = '../test/data/day14/test2'
                
        expect(await part2(file)).toBe(208)
    })
})
