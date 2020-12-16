import { part1, part2 } from "../src/day4"

describe('how many passports are valid?', () => {
    it('return 2', async () => {
        const file = '../test/data/day4/test1'
                
        expect(await part1(file)).toBe(2)
    })
})

describe('how many passports are valid?', () => {
    it('return 4', async () => {
        const file = '../test/data/day4/test2'
                
        expect(await part2(file)).toBe(4)
    })
})