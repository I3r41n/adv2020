import { part1, part2 } from "../src/day17"

describe('How many cubes are left in the active state after the sixth cycle?', () => {
    it('return 112', async () => {
        const file = '../test/data/day17/test1'
                
        expect(await part1(file)).toBe(112)
    })
})

describe('How many cubes are left in the active state after the sixth cycle?', () => {
    it('return 848', async () => {
        const file = '../test/data/day17/test1'
                
        expect(await part2(file)).toBe(848)
    })
})