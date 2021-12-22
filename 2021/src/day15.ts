import { getRunner, PriorityQueue } from './core'

const day = 15
class Graph {
    private graph: Map<string, Map<string, number>>

    constructor() { this.graph = new Map() }

    addNode = (a: string) => {
        this.graph.set(a, new Map<string, number>())
        return this
    }

    addVertex = (a: string, b: string, d: number) => {
        this.graph.get(a).set(b, d)
        return this
    }

    print = () => console.log(this.graph)

    dijstra = (start: string, goal: string) => {
        const visited = new Set<string>()
        const queue = new PriorityQueue<string>()
        
        queue.enqueue(start, 0)
    
        while(!queue.isEmpty() ) {
            const {priority: cost, value: key} = queue.dequeue()
            visited.add(key)
            
            if(goal === key) { return cost }
            
            for(let [k, v] of (this.graph.get(key) || new Map<string, number>()).entries()){
                const nodeCost = v + cost

                if(visited.has(k) || queue.data.includes(k)) continue

                queue.enqueue(k, nodeCost)
            }
        }

        return 0
    }
}

const transform = (s: string): number[] => s.split('').map(c => +c)

const calculate = async (maybe_nodes: Promise<number[][]>) => {
    const matrix = (await maybe_nodes)
    const maxY = matrix.length - 1
    const maxX = matrix[0].length - 1
    const goal = `${maxY}-${maxX}`

    const graph = matrix.reduce((g, row, y) => {
        row.forEach((_, x) => {
            const node = `${x}-${y}`
            g.addNode(node)
            if (y < maxY) g.addVertex(node, `${x}-${y + 1}`, matrix[y + 1][x])
            if (x < maxX) g.addVertex(node, `${x + 1}-${y}`, matrix[y][x + 1])
            if (y > 0) g.addVertex(node, `${x}-${y - 1}`, matrix[y - 1][x])
            if (x > 0) g.addVertex(node, `${x - 1}-${y}`, matrix[y][x - 1])
        })

        return g
    }, new Graph())

    // graph.print()

    return graph.dijstra("0-0", goal)
}


const calculate2 = async (maybe_nodes: Promise<number[][]>) => {
    const matrix = (await maybe_nodes)
    const maxY = (matrix.length * 5)- 1
    const maxX = (matrix[0].length * 5)- 1
    const goal = `${maxY}-${maxX}`

    const getValue = (y:number, x:number) => ((matrix[y % matrix.length][x % matrix.length] +
        Math.floor(x/ matrix.length) + Math.floor(y/ matrix.length) + 8) % 9) +1;
    
    const graph = new Graph();

    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            const node = `${x}-${y}`
            graph.addNode(node)
            if (y < maxY) graph.addVertex(node, `${x}-${y + 1}`, getValue((y + 1), x))
            if (x < maxX) graph.addVertex(node, `${x + 1}-${y}`, getValue(y ,(x + 1)))
            if (y > 0) graph.addVertex(node, `${x}-${y - 1}`, getValue((y - 1), x))
            if (x > 0) graph.addVertex(node, `${x - 1}-${y}`, getValue(y ,(x - 1)))
        }
    }

    return graph.dijstra("0-0", goal)
}


const { part1, part2
    // , run
} = getRunner(`./data/day${day}.txt`, calculate, calculate2, transform)


// run()

export { part1, part2 }

