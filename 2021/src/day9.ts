import { identity, take } from 'lodash'
import { getRunner, TreeNode } from './core'
const day = 9

const transformLines = (line: string) => line.split('').map(c => +c)

const neighbors = <T>(x: number , y: number, map:T[][]) =>  [
        y > 0 && { x, y: y - 1, value: map[x][y-1] } || undefined as TreeNode<T>,
        y < map[0].length - 1 && { x, y: y + 1, value: map[x][y+1] } || undefined as TreeNode<T>, 
        x > 0 && { x: x - 1, y, value: map[x-1][y] } || undefined as TreeNode<T>,
        x < map.length - 1 && { x: x + 1, y, value: map[x+1][y] } || undefined as TreeNode<T>
    ].filter(i => i)

const transverse = <T>(
        start: TreeNode<T>[], 
        tree: TreeNode<T>[],
        filter_node: (node: TreeNode<T>)=> boolean = identity):TreeNode<T>[] => {
            
    const aux = <T>(
        queue:  TreeNode<T>[], 
        visited: TreeNode<T>[]) => {

        if (queue.length === 0) return visited

        const next = queue.reduce((acc, cur) => {
            const was_visited = visited.find(
                    ({x,y}) => x === cur.x && y == cur.y ) 
            
            return !!was_visited 
                ? acc 
                : acc.concat(cur.neighbours.map(n => 
                    tree.find(({x,y}) => x === n.x && y == n.y ))
                    .filter(filter_node))
        }, [])
        
        return aux<T>(next, [...new Set([...visited, ...queue])]) 
    }
    
    return aux(start, [])
}

const low_values = (heightmap: number[][]) => 
    heightmap.reduce((acc, row, x) => 
        acc.concat(row.map((value, y) => ({
            x,
            y, 
            neighbours: neighbors(x,y, heightmap),
            value
        }))), [] as TreeNode<number>[]
    )
    .filter(({neighbours, value}) => 
        neighbours.every((n => n.value > value)))
              

const calculate = async (data: Promise<number[][]>) =>
    low_values((await data)).reduce((acc, cur) => acc += cur.value + 1, 0)

const calculate2 = async (data: Promise<number[][]>) => {
    const heightmap = (await data)
    const tree = heightmap.reduce((acc, row, x) => 
        acc.concat(row.map((value, y) => ({
            x,
            y, 
            neighbours: neighbors(x,y, heightmap),
            value
        }))), [] as TreeNode<number>[]
    )

    const low_points = tree
        .filter(({neighbours, value}) => 
            neighbours.every((n => n.value > value))  )

    const basins = low_points.map(lp => transverse([lp], tree, ({value}) => value < 9))        
    
    return take(basins.map((a) => a.length).sort((a,b) => b - a), 3).reduce((acc, cur) => acc *= cur, 1)
}

const { part1, part2
    // ,run
} = getRunner(`./data/day${day}.txt`, calculate, calculate2, transformLines)

// run()

export { part1, part2 }

