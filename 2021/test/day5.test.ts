import { part1, part2 } from "../src/day5"

const day = 5
const testSource = `../test/data/day${day}`

describe('At how many points do at least two lines overlap?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part1(file)).toBe(5)
    })
})

describe('with diagonal lines at how many points do at least two lines overlap?', () => {
    it('return ', async () => {
        const file = `${testSource}/test1`
                
        expect(await part2(file)).toBe(12)
    })
})