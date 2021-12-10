import { part1, part2 } from "../src/day9"

const day = 9
const testSource = `../test/data/day${day}`

describe('What do you get if you multiply together the sizes of the three largest basins?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(15)
    })
})

describe('What do you get if you multiply together the sizes of the three largest basins?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(1134)
    })
})