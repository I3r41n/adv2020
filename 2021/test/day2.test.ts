import { part1, part2 } from "../src/day2"

describe('What do you get if you multiply your final horizontal position by your final depth?', () => {
    it('return 150', async () => {
        const file = '../test/data/day2/test1'
                
        expect(await part1(file)).toBe(150)
    })
})

describe('What do you get if you multiply your final horizontal position by your final depth?', () => {
    it('return 900', async () => {
        const file = '../test/data/day2/test1'
                
        expect(await part2(file)).toBe(900)
    })
})