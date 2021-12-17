import { part1 } from "../src/day13"

const day = 13
const testSource = `../test/data/day${day}`

describe('How many dots are visible after completing just the first fold instruction on your transparent paper?', () => {
    it('return 17', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(17)
    })
})
