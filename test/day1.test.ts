import {part1, part2} from '../src/day1'

describe('find the two entries that sum to 2020 and then multiply', () => {
    it("multiply 1 and 2019 the only ones on the list", async () => {
        const file = '../test/data/day1/test1'
                
        expect(await part1(file)).toBe(2019)

    })

    it("multiply 1721 and 299", async () => {
        const file = '../test/data/day1/test2'
                
        expect(await part1(file)).toBe(514579)
    })
})


describe('find the tree entries that sum to 2020 and then multiply', () => {
    it("multiply 1, 19 and 2000 the only ones on the list", async () => {
        const file = '../test/data/day1/test1'
                
        expect(await part2(file)).toBe(38000)

    })

    it("multiply 979, 366 and 675", async () => {
        const file = '../test/data/day1/test2'
                
        expect(await part2(file)).toBe(241861950)
    })
})