import { keys } from 'lodash'
import  {getRunner} from './core'

const updatePassport = (list: any[], description: string) => {
    const matches = [...description.matchAll(/(?<key>byr|iyr|eyr|hgt|hcl|ecl|pid|cid):(?<value>[^ \n]+)/g)]
    const updatedPassort = matches.reduce((acc, {groups}) => ({...acc, ...{[groups.key]: groups.value}}), list.pop())
    
    list.push(updatedPassort)
    return list
}

const expectedKeys = ['byr','iyr','eyr','hgt','hcl','ecl','pid']

const valid = p => {
      const rules = {
        'byr': /^19[2-9]\d|(200[0-2])$/,
        'iyr': /^201\d|(2020)$/,
        'eyr': /^202\d|(2030)$/,
        'hgt': /^((1[5-8]\d|19[0-3])cm)$|^((59|6\d|7[0-6])in)$/,     
        'hcl': /^#[0-9a-f]{6}$/,
        'ecl': /^(amb|blu|brn|gry|grn|hzl|oth)$/,
        'pid': /^\d{9}$/
    }

    return keys(rules).reduce((acc, cur) => (acc && p[cur] && rules[cur].test(p[cur])), true)
}

const validate = async (v: Promise<any[]>, valid) => {
    const passports = (await v).reduce((acc, cur) => {
        return cur == '' 
        ? (acc.push({}), acc)
        : updatePassport(acc, cur)}
    , [{}])  
        
    return passports.filter(valid ).length
}

const calculate = (v: Promise<any[]>) =>validate(v, p => expectedKeys.every(key => key in p))
const calculate2 = (v: Promise<any[]>) =>validate(v, valid)

const {part1, part2} = getRunner('./data/day4.txt', calculate, calculate2)

export { part1, part2 }