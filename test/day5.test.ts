import { part1 } from "../src/day5"

describe('What is the highest seat ID on a boarding pass?', () => {
    it('return 820', async () => {
        const file = '../test/data/day5/test1'
                
        expect(await part1(file)).toBe(820)
    })
})