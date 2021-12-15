import { countBy, keys, values } from 'lodash'
import  {getRunner} from './core'
const day = 12

interface Graph {
    [key:string]: string[]; // (A)
}


const dfs = (g: Graph, s: string, v: string, was_visited: (s:string, p:string[], visited: {[key:string]: boolean}) => boolean) => {
    const visited: {[key:string]: boolean} = {}
    const paths: string[][] = []

    const aux = (u:string, d:string, path:string[] = []) => {
        const backpath = (u:string) => (visited[u] = false, path.pop())

        if (was_visited(u, path, visited)) return
        visited[u] = isLowerCase(u) 

        
        path.push(u)

        if(u === d){   
            paths.push([...path])
            backpath(u)
            return
        }

        g[u].forEach(candidate => aux(candidate, v, path))

        backpath(u)
    }

    aux(s, v)
    return paths
}

const toGraph = async (lines: Promise<string[][]>) => (await lines).reduce((acc, [v, w]) => {
    if (!keys(acc).includes(v))
        acc =  {...acc, ...{[v]: []}}

    acc[v].push(w)

    if (!keys(acc).includes(w))
        acc =  {...acc, ...{[w]: []}}
    acc[w].push(v)

    return acc
}, {} as Graph)

const calculate = async (lines: Promise<string[][]>) => {
    const tree: Graph = await toGraph(lines)
   

    const paths = dfs(tree, 'start', 'end', (u:string, _:string[], v:{ [key: string]: boolean; }) => v[u])
    return paths.length
}

const isLowerCase = (u:string) => /[a-z]{1}.*/.test(u)

const calculate2 = async (lines: Promise<string[][]>) => {
    const was_visited = (u:string, path: string[], visited: {[key:string]: boolean}) => {
        const actual_value =  visited[u]
        const is_start_or_goal = ['start', 'end'].includes(u)
        
        const is_lower = isLowerCase(u)
        const is_upper = !is_lower
        const frequency = countBy(path.filter(c => isLowerCase(c)))
        
        return (is_start_or_goal || is_upper) 
            ? actual_value
            : values(frequency).some( c => c > 1 ) && frequency[u] > 0
    }  
    
    const tree: Graph = await toGraph(lines)
    
    const paths = dfs(tree, 'start', 'end', was_visited)
    
    return paths.length
}

    

const {part1, part2
    // ,run
    } = getRunner(`./data/day${day}.txt`, calculate, calculate2, (l:string) => l.split('-'))


// run()

export { part1, part2 }

