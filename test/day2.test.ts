import { part1, part2 } from "../src/day2"

describe('How many passwords are valid according to their policies?', () => {
    it('return 2', async () => {
        const file = '../test/data/day2/test1'
                
        expect(await part1(file)).toBe(2)
    })
})

describe('How many passwords are valid according to their policies?', () => {
    it('return 1', async () => {
        const file = '../test/data/day2/test1'
                
        expect(await part2(file)).toBe(1)
    })
})