import { part1, part2 } from "../src/day3"

describe('What is the power consumption of the submarine?', () => {
    it('return ', async () => {
        const file = '../test/data/day3/test1'
                
        expect(await part1(file)).toBe(198)
    })
})

describe('What is the life support rating of the submarine?', () => {
    it('return ', async () => {
        const file = '../test/data/day3/test1'
                
        expect(await part2(file)).toBe(230)
    })
})