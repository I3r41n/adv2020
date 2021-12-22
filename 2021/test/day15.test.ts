import { part1, part2 } from "../src/day15"

const day = 15
const testSource = `../test/data/day${day}`

describe('What is the lowest total risk of any path from the top left to the bottom right?', () => {
    it('return 40', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(40)
    })
})

xdescribe('What is the lowest total risk of any path from the top left to the bottom right? (5 Times bigger)', () => {
    it('return 315', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(315)
    })
})