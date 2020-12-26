import { part1, part2 } from "../src/day13"

describe('What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you\'ll need to wait for that bus?', () => {
    it('return 295', async () => {
        const file = '../test/data/day13/test1'
                
        expect(await part1(file)).toBe("295")
    })
})

describe('What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?', () => {
    it('return 1068781', async () => {
        const file = '../test/data/day13/test1'
                
        expect(await part2(file)).toBe("1068781")
    })
})
