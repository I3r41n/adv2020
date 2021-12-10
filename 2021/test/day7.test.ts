import { part1, part2 } from "../src/day7"

const day = 7
const testSource = `../test/data/day${day}`

describe('How much fuel must they spend to align to that position?', () => {
    it('return 37', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(37)
    })
})

describe('How much fuel must they spend to align to that position?', () => {
    it('return 168', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(168)
    })
})