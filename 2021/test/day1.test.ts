import {part1, part2} from '../src/day1'

describe('How many measurements are larger than the previous measurement?', () => {
    it("there are 7 measurements", async () => {
        const file = '../test/data/day1/test1'
                
        expect(await part1(file)).toBe(7)

    })

    describe('using a 3 number sliding window', () => {
        it("there are 5 measurements", async () => {
            const file = '../test/data/day1/test1'
                    
            expect(await part2(file)).toBe(5)

        })
    })
})