import { part1, part2 } from "../src/day18"

describe('what is the sum of the resulting values?', () => {
    it('return 26457', async () => {
        const file = '../test/data/day18/test1'
                
        expect(await part1(file)).toBe(26457)
    })
})

describe('what is the sum of the resulting values?', () => {
    it('return 694173', async () => {
        const file = '../test/data/day18/test1'
                
        expect(await part2(file)).toBe(694173)
    })
})