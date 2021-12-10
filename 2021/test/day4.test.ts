import { part1, part2 } from "../src/day4"

const day = 4
const testSource = `../test/data/day${day}`

describe('What will your final score be if you choose that board?', () => {
    it('return 4512', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(4512)
    })
})

describe('Once the last board wins, what would its final score be?', () => {
    it('return 1924', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(1924)
    })
})