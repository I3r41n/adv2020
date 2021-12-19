import { part1, part2 } from "../src/day14"

const day = 14
const testSource = `../test/data/day${day}`

describe('What do you get if you take the quantity of the most common element and subtract the quantity of the least common element 2ith 10 steps?', () => {
    it('return 1588', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(1588)
    })
})

describe('What do you get if you take the quantity of the most common element and subtract the quantity of the least common element with 40 steps?', () => {
    it('return 2188189693529', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(2188189693529)
    })
})