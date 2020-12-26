import { partition } from 'lodash'
import { getRunner } from './core'

const processData = async (listPromise: Promise<string[]>) => {
    const [rules, messages] = partition((await listPromise).filter(s => s), (s => s.indexOf(':') > 0))

    const rulesSummary = rules.reduce((acc, cur) => {
        const [key, values] = cur.split(':')

        return {
            ...acc, ...{
                [key]: values.split(' ').filter(v => v != '')
                    .map(s => s.replace(/"/g, ''))
            }
        }
    }, {} as Record<string, string[]>)

    return { rulesSummary, messages }
}

const getRegex = (ruleSummary: Record<string, string[]>, rule: string[], pos: number = 0) => {
    const values: string[] = ruleSummary[rule[pos]] || []

    return pos < rule.length
        ? getRegex(
            ruleSummary,
            values.length > 1
                ? [...rule.slice(0, pos), '(', ...values, ')', ...rule.slice(pos + 1)]
                : rule.map(r => r === rule[pos] ? (values[0] || r) : r),
            ['a', 'b', '(', ')', '|'].includes(rule[pos]) ? pos + 1 : pos)
        : rule
}

const calculate = async (listPromise: Promise<string[]>) => {
    const { rulesSummary, messages } = await processData(listPromise)

    const regex = new RegExp('^' + getRegex(rulesSummary, rulesSummary[0]).join('') + '$')
    return messages.filter(m => regex.test(m)).length
}


const calculate2 = async (listPromise: Promise<string[]>) => {
    const { rulesSummary, messages } = await processData(listPromise)

    const updateRulesSummary = {
        ...rulesSummary,
        ...{ '8': ['42'] },  //(42)+ = 42 | 42 8
        ...{ '11': ['42', '31'] } //(42){x}(31){x} = 42 31 | 42 11 31
    } as Record<string, string[]>
   
    const rule42 = new RegExp(getRegex(updateRulesSummary, updateRulesSummary[42]).join(''), 'g')
    const rule31 = new RegExp(getRegex(updateRulesSummary, updateRulesSummary[31]).join(''), 'g')
    const rule42n31 = new RegExp(
        '^(?<r42>(' + getRegex(updateRulesSummary, updateRulesSummary[42]).join('') + ')+)(?<r31>(' + getRegex(updateRulesSummary, updateRulesSummary[31]).join('') + ')+)$')
  
    return messages.filter(m => {
        const matches = rule42n31.exec(m)  
         
        return matches && 
            (matches.groups['r42'] && matches.groups['r42'].match(rule42).length) >
            (matches.groups['r31'] && matches.groups['r31'].match(rule31).length)
    }).length
}


const { part1, part2
    // , run
} = getRunner('./data/day19.txt', calculate, calculate2)

export { part1, part2 }

// run()