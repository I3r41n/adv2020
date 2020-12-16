import { part1, part2 } from "../src/day10"

describe('What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?', () => {
    it('return 35', async () => {
        const file = '../test/data/day10/test1'
                
        expect(await part1(file)).toBe(35)
    })

    it('return 220', async () => {
        const file = '../test/data/day10/test2'
                
        expect(await part1(file)).toBe(220)
    })
})


describe('What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?', () => {
    it('return 8', async () => {
        const file = '../test/data/day10/test1'
                
        expect(await part2(file)).toBe(8)
    })

    it('return 19208', async () => {
        const file = '../test/data/day10/test2'
                
        expect(await part2(file)).toBe(19208)
    })
})