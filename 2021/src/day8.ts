import { flatten, flattenDeep, keys } from 'lodash'
import  {getRunner} from './core'
const day = 8

// 0:      1:      2:      3:      4:
// aaaa    ....    aaaa    aaaa    ....   
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
// ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
// gggg    ....    gggg    gggg    ....

// 5:      6:      7:      8:      9:
// aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
// dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
// gggg    gggg    ....    gggg    gggg


//  diff 2 3 - e f 2 5 - bcef 3 5 bc

//  23 [1] => F 35 [1] => C   FC 
type signal = {inputs: string[], outputs: string[]}

const transformLines =  (value: string) => {
    const [inputs, outputs] = value.split('|')
    return {
        inputs: inputs.trim().split(" "), 
        outputs: outputs.trim().split(" ") 
    } as signal
}   


const intersection = <T>(set1: Set<T>, set2:Set<T>) => 
    new Set([...[...set1].filter(x => set2.has(x)),
             ...[...set2].filter(x => set1.has(x))])


const equalSet =  <T>(set1: Set<T>, set2:Set<T>) => 
    set1.size == set2.size && 
        Array.from(set1).every((a: T) => set2.has(a))


const getKeyByValue = (object: Object, value: Set<string>) => 
    keys(object)
        .filter(k => object[k].size == value.size)
        .find(k => Array.from(value).every((a: string) => object[k].has(a)))
      

const calculate = async (data: Promise<signal[]>) => 
    flattenDeep((await data).map(({outputs}) => outputs))
        .filter(o => [2, 3, 4,7].includes(o.length))
        .length

const calculate2 = async (data: Promise<signal[]>) => 
    (await data).reduce((acc, {inputs, outputs}) => {
    
        const segments_by_len = Array.from(inputs)
            .reduce((acc, cur) => {
                acc[cur.length].push(cur.split(''))
                return acc
            }, {2:[], 3:[], 4:[], 5:[], 6:[], 7:[]})
        
        const seven = new Set(segments_by_len[3][0])
        const three = new Set(flatten(segments_by_len[5].filter(d => intersection(new Set(d), seven).size === 3)))
        const four = new Set(segments_by_len[4][0])
        const six = new Set(flatten(segments_by_len[6].filter(d => intersection(new Set(d), seven).size == 2)))
        const nine =  new Set(flatten(segments_by_len[6].filter(d => intersection(new Set(d), four).size === 4)))
        const five = new Set(flatten(segments_by_len[5]
            .filter(d => !equalSet(new Set(d),three))
            .filter(d => intersection(new Set(d), nine).size === 5))) 

        
        const numbers = {
            0: new Set(flatten(segments_by_len[6].filter(d => !equalSet(new Set(d),six) && !equalSet(new Set(d), nine)))),
            1: new Set(segments_by_len[2][0]),
            2: new Set(flatten(segments_by_len[5].filter(d => !equalSet(new Set(d),three) && !equalSet(new Set(d), five)))),
            3: three,
            4: four,
            5: five, 
            6: six,
            7: seven,
            8: new Set(segments_by_len[7][0]),
            9: nine
        }
        
        const sum_outputs = +outputs.map(i => getKeyByValue(numbers, new Set(i.split('')))).join('')
        
        return acc += sum_outputs

    },0)

      

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, transformLines)


// run()

export { part1, part2 }

