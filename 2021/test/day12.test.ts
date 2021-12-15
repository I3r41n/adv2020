import { part1, part2 } from "../src/day12"

const day = 12
const testSource = `../test/data/day${day}`

describe('How many paths through this cave system are there that visit small caves at most once?', () => {
    it('return 10', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(10)
    })

    it('return 19', async () => {
        const file = `${testSource}/test2`
                
        expect(await part1(file)).toBe(19)
    })

    it('return 226', async () => {
        const file = `${testSource}/test3`
                
        expect(await part1(file)).toBe(226)
    })
})

describe('how many paths through this cave system are there', () => {
    it('return 36', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(36)
    })

    it('return 103', async () => {
        const file = `${testSource}/test2`
                
        expect(await part2(file)).toBe(103)
    })

    it('return 3509', async () => {
        const file = `${testSource}/test3`
                
        expect(await part2(file)).toBe(3509)
    })
})