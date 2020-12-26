import { part1, part2 } from "../src/day20"

describe('What do you get if you multiply together the IDs of the four corner tiles?', () => {
    it('return 20899048083289', async () => {
        const file = '../test/data/day20/test1'

        expect(await part1(file)).toBe(20899048083289)
    })
})

describe('How many # are not part of a sea monster?', () => {
    it('return 273', async () => {
        const file = '../test/data/day20/test1'

        expect(await part2(file)).toBe(273)
    })
})

