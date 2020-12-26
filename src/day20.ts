import { getRunner } from './core'
import { chunk, difference, drop, flatten, groupBy, identity, intersectionWith, isEmpty, isEqual, keys, min, range, reverse, values } from 'lodash'

type ROTATION = 0 | 90 | 180 | 270
const rotations = [0, 90, 180, 270] as ROTATION[]

const top = new Map<string, { tile: number, rot: ROTATION, isFlipped: boolean }[]>()
const bottom = new Map<string, { tile: number, rot: ROTATION, isFlipped: boolean }[]>()
const left = new Map<string, { tile: number, rot: ROTATION, isFlipped: boolean }[]>()
const right = new Map<string, { tile: number, rot: ROTATION, isFlipped: boolean }[]>()

const getLeft = (piece: string[]) => piece.map(c => c[0]).join('')
const getRight = (piece: string[]) => piece.map(c => c[9]).join('')
const getTop = (piece: string[]) => piece[0]
const getBottom = (piece: string[]) => piece[9]

const clearBorders = () => [top, bottom, left, right].forEach(m => m.clear())

const rotate = (i: string[]) => {
    const y = i.length - 1
    const matrix = i.map(s => s.split(''))
    return range(0, Math.floor(i.length / 2)).reduce((acc, i) => {
        range(i, y - i).forEach(j => {
            acc[i][j] = matrix[y - j][i];
            acc[y - j][i] = matrix[y - i][y - j];
            acc[y - i][y - j] = matrix[j][y - i]
            acc[j][y - i] = matrix[i][j]
        })
        return acc
    }, new Array(i.length).fill('').map(() => new Array(i.length).fill('')))
        .map(s => s.join(''))
}

const flip = (i: string[]) => i.map(e => (reverse(Array.from(e)).join('')))

const addAllBorders = (tile: number, original: string[]) => {
    const addBorders = (i: string[], rot: ROTATION, isFlipped: boolean) => {
        top.set(i[0],
            [...(top.get(i[0]) || []), { tile, rot, isFlipped }])

        bottom.set(i[9],
            [...(bottom.get(i[9]) || []), { tile, rot, isFlipped }])

        left.set(i.map(c => c[0]).join(''),
            [...(left.get(i.map(c => c[0]).join('')) || []), { tile, rot, isFlipped }])

        right.set(i.map(c => c[9]).join(''),
            [...(right.get(i.map(c => c[9]).join('')) || []), { tile, rot, isFlipped }])
    }

    rotations.forEach((rot, idx) => {
        const image = range(0, idx).reduce((acc, _) => rotate(acc), original)
        addBorders(image, rot, false)
        addBorders(flip(image), rot, true)
    })
}

const getCornersCandidates = (squareSize: number) => {
    const side = Math.sqrt(squareSize)

    return {
        '0,0': [...flatten(intersectionWith(
            [...top.values()].filter(v => v.length === 1),
            [...left.values()].filter(v => v.length === 1), isEqual))],
        [`0,${side - 1}`]: [...flatten(intersectionWith(
            [...top.values()].filter(v => v.length === 1),
            [...right.values()].filter(v => v.length === 1),
            isEqual))],
        [`${side - 1},0`]: [...flatten(intersectionWith(
            [...bottom.values()].filter(v => v.length === 1),
            [...left.values()].filter(v => v.length === 1),
            isEqual))],
        [`${side - 1},${side - 1}`]: [...flatten(intersectionWith(
            [...bottom.values()].filter(v => v.length === 1),
            [...right.values()].filter(v => v.length === 1), isEqual))]
    } as Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }[]>
}

const calculate = async (mapPromise: Promise<string[]>) => {
    clearBorders()
    const pieces = chunk((await mapPromise), 12).reduce((acc, cur) => {
        const tile = Number(cur[0].slice(cur[0].indexOf(' '), cur[0].indexOf(':')).trim())
        const original = drop(cur.filter(c => c.length))
        addAllBorders(tile, original)

        return acc.set(tile, original)
    }, new Map<number, string[]>())

    const corners = new Set(flatten(values(getCornersCandidates([...pieces.keys()].length))).map(c => c.tile))

    return [...corners].reduce((acc, cur) => acc * cur, 1)
}

const getVersion = (image: { tile: number; rot: ROTATION; isFlipped: boolean; }, puzzle: Map<number, string[]>) => {
    const rotated = range(0, rotations.indexOf(image.rot)).reduce((acc, _) => rotate(acc), puzzle.get(image.tile))
    return image.isFlipped ? flip(rotated) : rotated
}

const getNextCandidates = (status: Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>,
    puzzle: Map<number, string[]>) => {
        
    const available = difference([...puzzle.keys()], keys(status).map(s => status[s] && status[s].tile))
    const [x, y] = keys(status).filter(s => !status[s])[0].split(',').map(Number)

    const matchesToLook = [
        status[`${x},${y - 1}`] && left.get(getRight(getVersion(status[`${x},${y - 1}`], puzzle))) || [],
        status[`${x},${y + 1}`] && right.get(getLeft(getVersion(status[`${x},${y + 1}`], puzzle))) || [],
        status[`${x - 1},${y}`] && top.get(getBottom(getVersion(status[`${x - 1},${y}`], puzzle))) || [],
        status[`${x + 1},${y}`] && bottom.get(getTop(getVersion(status[`${x + 1},${y}`], puzzle))) || [],
    ].filter(arr => !isEmpty(arr)).reduce((acc, cur) => intersectionWith(acc, cur, isEqual))

    return flatten(matchesToLook)
        .filter(({ tile }) => available.includes(tile))
        .map(m => ({ ...status, ...{ [`${x},${y}`]: m } }))
}

const dfs = (start: Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>, puzzle: Map<number, string[]>) => {
    const stack: Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>[] = [start]
    const visited = new Set<Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>>();
    while (stack.length) {
        const current = stack.pop()
        const available = difference([...puzzle.keys()], 
                                      keys(current).map(s => current[s] && current[s].tile))
        
        if (!available.length) return current

        if (!visited.has(current)) {
            visited.add(current)
            available.length && 
                getNextCandidates(current, puzzle)
                .forEach(candidate => !visited.has(candidate) && stack.push(candidate))
        }
    }
    return null
}

const puzzleToImage: (puzzle: Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>, 
                      pieces: Map<number, string[]>) => string[] = (puzzle, pieces) => {
                          
    const removedBorders = keys(puzzle)
        .map(k => getVersion(puzzle[k], pieces).slice(1,9).map(s => s.slice(1,9)))
     
    return flatten(chunk(removedBorders, Math.sqrt(keys(puzzle).length))
                .map(s => s.reduce((acc, cur) => 
                    (cur.forEach((r, y) => acc[y] += r ), acc)
            ,new Array(8).fill('') as string [])))
    }

const findMonsters = (image: string[]) => {
    //                  # 
    //#    ##    ##    ### 
    //#  #  #  #  #  #   

    //.{18}#
    //.{4}##.{4}##.{4}###
    //#(.{2}#){5}

    const head = /.{18}#/
    const body = /.{4}##.{4}##.{4}###/
    const feet = /#(.{2}#){5}/
    const monsters = image.reduce((acc, cur, idx) => {
        head.test(cur) && body.test(image[idx+1]) && feet.test(image[idx+2]) && acc++
        return acc
    }
    , 0)

    return image.map(c => c.split('').filter(c => c === '#').length).reduce((acc, cur) => acc + cur, 0) -  monsters * 15 
}


const calculate2 = async (mapPromise: Promise<string[]>) => {
    clearBorders()
    
    const pieces = chunk((await mapPromise), 12).reduce((acc, cur) => {
        const tile = Number(cur[0].slice(cur[0].indexOf(' '), cur[0].indexOf(':')).trim())
        const original = drop(cur.filter(c => c.length))
        addAllBorders(tile, original)

        return acc.set(tile, original)
    }, new Map<number, string[]>())

    const len = [...pieces.keys()].length
    const corners = getCornersCandidates(len)

    const template = flatten(range(0, Math.sqrt(len)).map(x => range(0, Math.sqrt(len)).map(y => `${x},${y}`)))
        .reduce((acc, cur) => ({ ...acc, [cur]: undefined }), {})

    const possibleStarts = keys(corners)
        .reduce((acc, cur) => {
            const newFields = corners[cur].map(value => ({ [cur]: value }))

            return acc.length
                ? newFields.reduce((news, n) => ([...news, ...acc.map(a => ({ ...a, ...n }))]),
                    [] as Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>[])
                : newFields
        }, [] as Record<string, { tile: number, rot: ROTATION, isFlipped: boolean }>[])
        .filter(v => keys(groupBy(values(v), 'tile')).length === 4)
        .map(c => ({ ...template, ...c }))

    const monsters = possibleStarts
            .map(candidate => dfs(candidate, pieces))
            .filter(identity)
            .map(solution => puzzleToImage(solution, pieces))
            .map(findMonsters)
                
    return min(monsters)
}
const { part1, part2
    // ,run
} = getRunner('./data/day20.txt', calculate, calculate2)

export { part1, part2 }

// run()