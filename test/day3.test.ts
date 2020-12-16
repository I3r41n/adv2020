import { part1, part2 } from "../src/day3"

describe('How many tree were seen', () => {
    it('return 7', async () => {
        const file = '../test/data/day3/test1'
                
        expect(await part1(file)).toBe(7)
    })
})

describe('What do you get if you multiply together the number of trees encountered on each of the listed slopes?', () => {
    it('return 336', async () => {
        const file = '../test/data/day3/test1'
                
        expect(await part2(file)).toBe(336)
    })
})