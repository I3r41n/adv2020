import { part1, part2 } from "../src/day11"

const day = 11
const testSource = `../test/data/day${day}`

describe('How many total flashes are there after 100 steps?', () => {
    it('return 1656', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(1656)
    })
})

describe('What is the first step during which all octopuses flash?', () => {
    it('return 195', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(195)
    })
})