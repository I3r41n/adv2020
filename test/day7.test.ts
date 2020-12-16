import { part1, part2 } from "../src/day7"

describe('How many bag colors can eventually contain at least one shiny gold bag?', () => {
    it('return 4', async () => {
        const file = '../test/data/day7/test1'
                
        expect(await part1(file)).toBe(4)
    })
})

describe('How many individual bags are required inside your single shiny gold bag?', () => {
    it('return 32', async () => {
        const file = '../test/data/day7/test1'
                
        expect(await part2(file)).toBe(32)
    })

    it('return 126', async () => {
        const file = '../test/data/day7/test2'
                
        expect(await part2(file)).toBe(126)
    })
})