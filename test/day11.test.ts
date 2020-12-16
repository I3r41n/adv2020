import { part2 } from "../src/day11"

// describe('How many seats end up occupied?', () => {
//     it('return 37', async () => {
//         const file = '../test/data/day11/test1'
                
//         expect(await part1(file)).toBe(37)
//     })
// })

describe('How many seats end up occupied?', () => {
    it('return 26', async () => {
        const file = '../test/data/day11/test1'
                
        expect(await part2(file)).toBe(26)
    })
})