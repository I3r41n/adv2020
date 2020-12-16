import  {getRunner} from './core'

type Descriptor = {
    minimum: number;
    maximum: number;
    char: string;
    password: string;
}

const valid = ({minimum, maximum, char, password}: Descriptor) => {
    const occur = (password.split(char).length - 1) 
    return occur >= minimum && occur <= maximum
}

const hasOneOccurence =  ({minimum, maximum, char, password}: Descriptor) => {
    const first = password[minimum-1]
    const second = password[maximum-1]
    return (first == char || second == char ) && first != second
}

const calculate = async (values: Promise<Descriptor[]>) => (await values).filter(valid).length 

const calculate2 = async (values: Promise<Descriptor[]>) => (await values).filter(hasOneOccurence).length 

const parser: (s:string) => Descriptor = (s: string) => {
    const [, minimum, maximum, char, password] = s.match(/(\d+)-(\d+) ([a-zA-Z]{1}): ([a-zA-Z]*)/)
    return {
        minimum:parseInt(minimum), 
        maximum:parseInt(maximum), 
        char, 
        password
    }
}
const {part1, part2} = getRunner('./data/day2.txt', calculate, calculate2, parser)

export { part1, part2 }
