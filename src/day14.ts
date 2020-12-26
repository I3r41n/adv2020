import { concat, drop, slice } from 'lodash'
import { getRunner } from './core'

interface MaskChange { idx: number, value: '0' | '1' | 'X' }
interface Mask { type: 'Mask', changes: [MaskChange] }
interface Memory { type: 'Memory', idx: number, value: number, binary: string[], mask?: Mask }

const transf: (s: string) => Mask | Memory = s => {
    const getMask = () => ({
        type: 'Mask',
        changes:
            [...s.matchAll(/mask = (?<mask>.+)/g)][0].groups['mask'].split('')
                .reverse()
                .map((s, idx) => ({ idx, value: s }))
    }) as Mask

    const getMemory = () => {
        const matches = [...s.matchAll(/mem\[(?<position>[\d]+)\] = (?<value>[\d]+)/g)][0]
        const binary = parseInt(matches.groups['value']).toString(2).split('').reverse()

        return {
            type: 'Memory',
            idx: parseInt(matches.groups['position']),
            value: parseInt(matches.groups['value']),
            binary: binary.length < 36 ? [...binary, ...Array.from(Array(36 - binary.length)).fill("0")] : binary
        } as Memory
    }
    return s[1] === 'a' ? getMask() : getMemory()
}

const calculate = async (dataPromise: Promise<(Mask | Memory)[]>) => {
    const assignMasks = (arr: (Memory | Mask)[], mask: Mask = null, acc: Memory[] = []) => {
        const setMemories = (memories: Memory[], mem: Memory, mask: Mask) =>
            [...memories, { ...mem, mask } as Memory]
        const cur = !!arr.length && arr[0]

        return !cur ? acc : assignMasks(
            drop(arr, 1),
            cur.type === 'Mask' ? cur as Mask : mask,
            cur.type === 'Memory' ? setMemories(acc, cur, mask) : acc
        )
    }

    const data: (Memory | Mask)[] = await dataPromise

    const memories = assignMasks(data).map(memory => {
        const newBinary = memory['mask'].changes.reduce((acc, { idx, value }) =>
            value === 'X' ? acc :
                [...slice(acc, 0, idx), value, ...slice(acc, idx + 1)], memory.binary)
        return {
            ...memory,
            binary: newBinary,
            value: parseInt(newBinary.reverse().join(''), 2)
        }
    })

    return memories
        .reduce((acc, cur) => [...acc.filter(({ idx }) => idx !== cur.idx), cur], [])
        .reduce((acc, cur) => acc + cur.value, 0)
}

const calculate2 = async (dataPromise: Promise<(Mask | Memory)[]>) => {
    const data = await dataPromise

    const applyMask = (mask: Mask, memories: Memory[]) => {
        //    console.log(mask, memories)
        const addChangeToAllMasks = (change: MaskChange, masks: Mask[]) =>
            (masks.map(({ changes }) => ({ type: "Mask", changes: [...changes, change] as MaskChange[] } as Mask)))

        const applyChanges = (memory: Memory, changes: MaskChange[]) => {
            // console.log(memory, changes)
            const idxBinary = memory.idx.toString(2).split('').reverse()
            const idxBinary36Bits = [...idxBinary, ...Array.from(Array(36 - idxBinary.length)).fill("0")]
            const reducer = (acc, { idx, value }) => (
                [...slice(acc, 0, idx), value, ...slice(acc, idx + 1)])

            const idx = parseInt(changes
                .reduce(reducer, idxBinary36Bits)
                .reverse()
                .join(''), 2)

            return { ...memory, idx } as Memory
        }

        const masksToApply = mask.changes.filter(({ value }) => '0' !== value)
            .reduce((acc, cur) =>
                cur.value === 'X'
                    ? concat(addChangeToAllMasks(({ ...cur, value: '0' }) as MaskChange, acc),
                             addChangeToAllMasks(({ ...cur, value: '1' }) as MaskChange, acc))
                    : addChangeToAllMasks(cur, acc)
                , [{ type: 'Mask', changes: [] as MaskChange[] } as Mask])
        // console.log(masksToApply)
        return memories.reduce((acc, cur) =>
            ([...acc, ...masksToApply.map(({ changes }) => applyChanges(cur, changes))]), [] as Memory[])
    }

    const aux = (values: (Mask | Memory)[], applied: Memory[]) => {
        const nextMask = drop(values, 1).findIndex((({ type }) => 'Mask' == type))
        
        return !values.length 
            ? applied
            : aux( -1 === nextMask? [] : drop(values, nextMask + 1),
                [...applied, ...applyMask(values[0] as Mask, 
                    (-1 === nextMask ? drop(values, 1) :
                    slice(values, 1, nextMask + 1) )as Memory[])])
    }

    return aux(data, []) 
        .reduce((acc, cur) => [...acc.filter(({ idx }) => idx !== cur.idx), cur], [])
        .reduce((acc, cur) => acc + cur.value, 0)
}



const { part1, part2
    // , run
} = getRunner('./data/day14.txt', calculate, calculate2, transf)

export { part1, part2 }

// run()