import { part1 , part2} from "../src/day6"

describe('What is the sum of those counts', () => {
    it('return 11', async () => {
        const file = '../test/data/day6/test1'
                
        expect(await part1(file)).toBe(11)
    })
})

describe('What is the sum of those counts?', () => {
    it('return 6', async () => {
        const file = '../test/data/day6/test1'
                
        expect(await part2(file)).toBe(6)
    })
})