import { part1, part2 } from "../src/day12"

describe('What is the Manhattan distance between that location and the ship\'s starting position?', () => {
    it('return 25', async () => {
        const file = '../test/data/day12/test1'
                
        expect(await part1(file)).toBe(25)
    })
})

describe('What is the Manhattan distance between that location and the ship\'s starting position?', () => {
    it('return 286', async () => {
        const file = '../test/data/day12/test1'
                
        expect(await part2(file)).toBe(286)
    })
})