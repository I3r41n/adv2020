import { readFile } from 'fs'
import { promisify } from 'util'
import _, { flow, identity, isObject, keys, partialRight } from 'lodash'

const read = async (filename: string) => promisify(readFile)(`${__dirname}/${filename}`, { encoding: 'utf-8' })

const cleanData = async (data: Promise<string>, transformLines: <T>(value: string, idx?: number) => T) =>
    (await data)
        .trim()
        .split('\n')
        .map((s, i) => transformLines(s, i))

const exercise = async (file: string, calculate, parser) =>
    flow([read, partialRight(cleanData, parser), calculate])(file)

const toString = f => isObject(f) ? keys(f).reduce((acc, cur) => acc + ` ${cur}: ${f[cur]} `, '{') + '}' : f

export class Runner<X, T> {
    firstExercise: <T>(filename?: string, extra?: number) => Promise<T>
    secondExercise: <T>(filename?: string, extra?: number) => Promise<T>

    constructor(file: string, calculate: (v: Promise<X[]>, extra?: number) => Promise<T>, calculate2: (v: Promise<X[]>) => Promise<T>, transformLines: (value: string, idx?: number) => X) {
        this.firstExercise = async (filename: string = file, extra?: number) => exercise(filename, partialRight(calculate, extra), transformLines)
        this.secondExercise = async (filename: string = file, extra?: number) => exercise(filename, partialRight(calculate2, extra), transformLines)
    }


    run = async () => {
        const first = await this.firstExercise()
        const second = await this.secondExercise()

        console.log(`results ${toString(first)} ${toString(second)}`)
    }
}

export const getRunner = <X, T>(filename: string,
    calculate: (v: Promise<X[]>) => Promise<T>,
    calculate2: (v: Promise<X[]>) => Promise<T>,
    transformLines: (value: string, idx?: number) => X = identity) => {
    const runner = new Runner(filename, calculate, calculate2, transformLines)
    const part1 = async (file: string, extra?: number) => runner.firstExercise(file, extra)
    const part2 = async (file: string, extra?: number) => runner.secondExercise(file, extra)

    return { part1, part2, run: async () => await runner.run() }
}


export type TreeNode<T> = {
    x: number,
    y: number,
    neighbours?: TreeNode<T>[],
    value: T
}


class PriorityNode<T> {
    priority: number
    value: T
    next: PriorityNode<T>

    constructor(value: T, priority: number) {
        this.value = value;
        this.priority = priority;
      }
  }


export class PriorityQueue<T> {
    private head: PriorityNode<T>;
    private tail: PriorityNode<T>;
  
    constructor() { }

    public enqueue(value: T, priority: number): PriorityNode<T> {
        const node = new PriorityNode(value, priority);
        if (!this.head) {
          this.head = this.tail = node;
        } else {
          let previous = this.head;
          if (previous.priority > priority) {
              node.next = previous;
              this.head = node;
              return node;
          }
          let next = previous?.next;
          while(previous && next) {
              if (next.priority > priority) {
                  node.next = next;
                  previous.next = node;
                  return node;
              }
              previous = previous.next;
              next = next.next;
          }
    
          this.tail.next = node;
          this.tail = node;
        }
        return node;
      }
    
      public dequeue(): PriorityNode<T> {
        if (!this.head) return null
        
        const oldHead = this.head;
        this.head  = oldHead.next;
        
        return oldHead;
      }
    
      public peek = ():T => this.head?.value;
      
      public isEmpty = (): boolean => this.head == null
    
      public get data() {
        const values = [];
        let head = this.head;
        while (head) {
              values.push(head.value);
              head = head.next;
        }
        return values;
      }
}
