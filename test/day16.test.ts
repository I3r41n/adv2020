import { part1, part2 } from "../src/day16"

describe('What is your ticket scanning error rate?', () => {
    it('return 71', async () => {
        const file = '../test/data/day16/test1'
                
        expect(await part1(file)).toBe(71)
    })
})

describe('Which field is which', () => {
    it('return Class: 1, Row: 7, Seat: 14', async () => {
        const file = '../test/data/day16/test1'
                
        expect(await part2(file)).toEqual({class: 1, row: 7, seat: 14})
    })

    it('return Class: 12, Row: 11, Seat: 13', async () => {
        const file = '../test/data/day16/test2'
                
        expect(await part2(file)).toEqual({class: 12, row: 11, seat: 13})
    })
})