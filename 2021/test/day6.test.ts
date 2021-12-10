import { part1, part2 } from "../src/day6"

const day = 6
const testSource = `../test/data/day${day}`

describe('How many lanternfish would there be after 80 days?', () => {
    it('return 5934', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(5934)
    })
})

describe('How many lanternfish would there be after 256 days?', () => {
    it('return 26984457539', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(26984457539)
    })
})