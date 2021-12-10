import  {getRunner} from './core'

type instruction = {
    movement: 'forward' | 'down' | 'up',
    quantity: number
}

const transformLines = (value: string, _idx?: number): instruction  => {
   const [movement, quantityString] = value.split(' ') 
   
   return { movement,
            quantity: parseInt(quantityString) } as instruction
}

type coord = {
    horizontal : number,
    depth: number,
    aim: number
}

const calculate = async (data: Promise<instruction[]>) => {
    const pos: coord = (await data).reduce((acc, {movement: m, quantity: q}) => {
         switch (m) {
           case 'forward': return {...acc, horizontal: acc.horizontal + q} ;
           case 'up': return {...acc, depth: acc.depth - q} ;
           case 'down': return {...acc, depth: acc.depth + q} ;
        }
        
    }, {horizontal: 0, depth: 0, aim: 0})

    return pos.depth * pos.horizontal
}

const calculate2 = async (data: Promise<instruction[]>) => {
    const pos: coord = (await data).reduce((acc, {movement: m, quantity: q}) => {
         switch (m) {
           case 'forward': return {...acc, horizontal: acc.horizontal + q, depth: acc.depth + acc.aim * q} ;
           case 'up': return {...acc, aim: acc.aim - q} ;
           case 'down': return {...acc, aim: acc.aim + q} ;
        }
        
    }, {horizontal: 0, depth: 0, aim: 0})

    return pos.depth * pos.horizontal
}
const {part1, part2
    // ,run
    } = getRunner('./data/day2.txt', calculate, calculate2, transformLines)

// run()

export { part1, part2 }

