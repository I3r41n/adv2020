import { part1, part2 } from "../src/day15"

describe('what will be the 2020th number spoken?', () => {
    it('return 436', async () => {
        const file = '../test/data/day15/test1'
                
        expect(await part1(file)).toBe(436)
    })
})

describe('what will be the 30000000th number spoken?', () => {
    it('return 175594', async () => {
        const file = '../test/data/day15/test1'
                
        expect(await part2(file)).toBe(175594)
    })
})