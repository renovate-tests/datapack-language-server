import * as assert from 'power-assert'
import BigNumber from 'bignumber.js'
import NbtTagArgumentParser from '../../parsers/NbtTagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { constructConfig, VanillaConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { EmptyGlobalCache } from '../../types/GlobalCache'
import { fail } from 'power-assert'
import { getNbtStringTag, getNbtByteTag, getNbtShortTag, getNbtIntTag, getNbtLongTag, getNbtFloatTag, getNbtDoubleTag, getNbtCompoundTag, getNbtListTag, getNbtByteArrayTag, getNbtLongArrayTag, getNbtIntArrayTag } from '../../types/NbtTag'
import { NBTNode, ValueList } from 'mc-nbt-paths'

describe('NbtTagArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtTagArgumentParser(['byte', 'compound', 'long_array'], 'blocks')
            const examples = parser.getExamples()
            assert.deepStrictEqual(examples, ['0b', '{}', '{foo: bar}', '[L; 0L]'])
        })
    })
    describe('parse() Tests', () => {
        it('Should parse quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('"bar\\""}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            // Use `deepEqual` instead of `deepStrictEqual`, because each tag has a unique function depending on `val`.
            assert.deepEqual(data, getNbtStringTag('bar"'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader("'bar")
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 4, end: 5 }, "expected an ending quote ‘'’ but got nothing")])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for empty input', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 0, end: 1 }, 'expected a tag but got nothing')])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return regular unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('foo:')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag('foo'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return byte', () => {
            const parser = new NbtTagArgumentParser('byte', 'blocks')
            const reader = new StringReader('1b}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat false as byte', () => {
            const parser = new NbtTagArgumentParser('byte', 'blocks')
            const reader = new StringReader('false')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteTag(0))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat true as byte', () => {
            const parser = new NbtTagArgumentParser('byte', 'blocks')
            const reader = new StringReader('true')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return short', () => {
            const parser = new NbtTagArgumentParser('short', 'blocks')
            const reader = new StringReader('32767s')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtShortTag(32767))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return int', () => {
            const parser = new NbtTagArgumentParser('int', 'blocks')
            const reader = new StringReader('1234567')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtIntTag(1234567))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return long', () => {
            const parser = new NbtTagArgumentParser('long', 'blocks')
            const reader = new StringReader('-1234567890L')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtLongTag(new BigNumber('-1234567890')))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return float', () => {
            const parser = new NbtTagArgumentParser('float', 'blocks')
            const reader = new StringReader('1.23f')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtFloatTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return double', () => {
            const parser = new NbtTagArgumentParser('double', 'blocks')
            const reader = new StringReader('1.23d')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return double from a string using scientific notation', () => {
            const parser = new NbtTagArgumentParser('double', 'blocks')
            const reader = new StringReader('123E-2d')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should recognize double implicited by decimal place', () => {
            const parser = new NbtTagArgumentParser('double', 'blocks')
            const reader = new StringReader('1.23')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range byte as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('233b')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag('233b'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 4 },
                'expected a number between -128 and 127 but got ‘233’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range short as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('32768s')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag('32768s'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 6 },
                'expected a number between -32,768 and 32,767 but got ‘32768’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range int as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('12345678901234')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag('12345678901234'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 14 },
                'expected a number between -2,147,483,648 and 2,147,483,647 but got ‘12345678901234’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range long as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('-9223372036854775809L')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtStringTag('-9223372036854775809L'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 21 },
                'expected a number between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807 but got ‘-9223372036854775809’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return a byte array', () => {
            const parser = new NbtTagArgumentParser('byte_array', 'blocks')
            const reader = new StringReader('[B; 1b, 2b]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtByteArrayTag([
                getNbtByteTag(1),
                getNbtByteTag(2)
            ])
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return an int array', () => {
            const parser = new NbtTagArgumentParser('int_array', 'blocks')
            const reader = new StringReader('[I; 1, 2]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtIntArrayTag([
                getNbtIntTag(1),
                getNbtIntTag(2)
            ])
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return a long array', () => {
            const parser = new NbtTagArgumentParser('long_array', 'blocks')
            const reader = new StringReader('[L; 1L, 2L]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtLongArrayTag([
                getNbtLongTag(new BigNumber(1)),
                getNbtLongTag(new BigNumber(2))
            ])
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return a list', () => {
            const parser = new NbtTagArgumentParser('list', 'blocks')
            const reader = new StringReader('[1b, 2b]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtListTag([
                getNbtByteTag(1),
                getNbtByteTag(2)
            ])
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return a compound', () => {
            const parser = new NbtTagArgumentParser('compound', 'blocks')
            const reader = new StringReader('{ foo: "bar", baz: {qux: 1b} }')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtCompoundTag({
                foo: getNbtStringTag('bar'),
                baz: getNbtCompoundTag({
                    qux: getNbtByteTag(1)
                })
            })
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return an empty compound', () => {
            const parser = new NbtTagArgumentParser('compound', 'blocks')
            const reader = new StringReader('{}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtCompoundTag({})
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for duplicate keys in a compound tag', () => {
            const parser = new NbtTagArgumentParser('compound', 'blocks')
            const reader = new StringReader('{foo: 1b, foo: 2b}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            const expected = getNbtCompoundTag({
                foo: getNbtByteTag(2)
            })
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 10, end: 13 },
                'duplicate compound key ‘foo’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for unexpected type', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1b')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteTag(1))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 2 },
                'expected a string tag instead of a byte tag'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for invalid keys in a compound tag', () => {
            const parser = new NbtTagArgumentParser('compound', 'blocks')
            const reader = new StringReader('{snake_case: 1b}')
            const config = constructConfig({
                lint: {
                    nameOfSnbtCompoundTagKeys: ['PascalCase', 'camelCase']
                }
            })
            const { data, errors, cache, completions } = parser.parse(reader, undefined, config, EmptyGlobalCache)
            assert.deepEqual(data, getNbtCompoundTag({
                snake_case: getNbtByteTag(1)
            }))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 1, end: 11 },
                "invalid key ‘snake_case’ which doesn't follow ‘PascalCase’ and ‘camelCase’ convention",
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for an unclosed list tag', () => {
            const parser = new NbtTagArgumentParser('list', 'blocks')
            const reader = new StringReader('[')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtListTag(
                []
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 1, end: 2 },
                'expected ‘]’ but got nothing'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for an unclosed byte array tag', () => {
            const parser = new NbtTagArgumentParser('byte_array', 'blocks')
            const reader = new StringReader('[B;')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtListTag(
                []
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 3, end: 4 },
                'expected ‘]’ but got nothing'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for an unclosed compound tag', () => {
            const parser = new NbtTagArgumentParser('compound', 'blocks')
            const reader = new StringReader('{')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtCompoundTag(
                {}
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 1, end: 2 },
                'expected ‘}’ but got nothing'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for unexpected tags in a list tag', () => {
            const parser = new NbtTagArgumentParser('list', 'blocks')
            const reader = new StringReader('[1b,1s]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtListTag(
                [getNbtByteTag(1), getNbtShortTag(1)]
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 4, end: 6 },
                'expected a byte tag instead of a short tag'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for unexpected tags in a byte array tag', () => {
            const parser = new NbtTagArgumentParser('byte_array', 'blocks')
            const reader = new StringReader('[B; 1b, 1s]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteArrayTag(
                [getNbtByteTag(1)]
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 8, end: 10 },
                'expected a byte tag instead of a short tag'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for unexpected tags in an int array tag', () => {
            const parser = new NbtTagArgumentParser('int_array', 'blocks')
            const reader = new StringReader('[I; 1, 1s]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtIntArrayTag(
                [getNbtIntTag(1)]
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 7, end: 9 },
                'expected an int tag instead of a short tag'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for unexpected tags in a long array tag', () => {
            const parser = new NbtTagArgumentParser('long_array', 'blocks')
            const reader = new StringReader('[L; 1L, 1s]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtLongArrayTag(
                [getNbtLongTag(new BigNumber(1))]
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 8, end: 10 },
                'expected a long tag instead of a short tag'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return errors for invalid types in an array tag', () => {
            const parser = new NbtTagArgumentParser('byte_array', 'blocks')
            const reader = new StringReader('[A; 1s]')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
            assert.deepEqual(data, getNbtByteArrayTag(
                []
            ))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 1, end: 2 },
                'invalid array type ‘A’. should be one of ‘B’, ‘I’ and ‘L’'
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        describe('Tests for Schemas', () => {
            const schemas: { [key: string]: NBTNode | ValueList } = {
                'block/banner.json': {
                    type: 'compound',
                    children: {
                        Base: {
                            type: 'int',
                            description: 'The base color of the banner'
                        },
                        list: {
                            type: 'list',
                            item: { type: 'no-nbt' }
                        },
                        listOfInts: {
                            type: 'list',
                            item: {
                                type: 'int'
                            }
                        },
                        refTest: {
                            type: 'no-nbt',
                            references: {
                                foo: { type: 'no-nbt', description: 'references test' }
                            }
                        }
                    }
                },
                'block/beacon.json': {
                    type: 'compound',
                    child_ref: [
                        '../ref/lockable.json',
                        '../ref/additional.json'
                    ],
                    children: {
                        Primary: {
                            type: 'int',
                            suggestions: [
                                {
                                    values: '../misc_group/effect_id.json'
                                }
                            ]
                        },
                        Secondary: {
                            type: 'int',
                            suggestions: [
                                {
                                    values: '../misc_group/effect_id.json'
                                }
                            ]
                        }
                    }
                },
                'block/command_block.json': {
                    type: 'compound',
                    children: {
                        auto: {
                            type: 'byte',
                            description: 'Whether the command block should be automatically powered'
                        },
                        Command: {
                            type: 'string',
                            description: 'The command to run',
                            suggestions: [
                                {
                                    function: {
                                        id: 'command'
                                    }
                                }
                            ]
                        },
                        conditionMet: {
                            type: 'byte',
                            description: 'If the command block executed last time it was powered (True if not conditional)'
                        },
                        LastExecution: {
                            type: 'long',
                            description: 'Tick the chain command block last executed'
                        },
                        LastOutput: {
                            type: 'string',
                            description: 'The description of the last output'
                        },
                        powered: {
                            type: 'byte',
                            description: 'If the command block is powered by redstone'
                        },
                        SuccessCount: {
                            type: 'int',
                            description: 'The success count of the command run'
                        },
                        TrackOutput: {
                            type: 'byte',
                            description: 'Should the command block should write to LastOutput'
                        },
                        UpdateLastExecution: {
                            type: 'byte',
                            description: 'Should the command block only execute once a tick'
                        }
                    }
                },
                'block/group/command_block.json': [
                    'minecraft:command_block',
                    'minecraft:chain_command_block',
                    {
                        description: 'A purple command block',
                        value: 'minecraft:repeating_command_block'
                    }
                ],
                'ref/lockable.json': {
                    type: 'compound',
                    children: {
                        Lock: {
                            type: 'string',
                            description: 'The name of the item a player has to be holding to open this container'
                        }
                    }
                },
                'ref/additional.json': {
                    type: 'compound',
                    additionalChildren: true,
                    children: {}
                },
                'roots/blocks.json': {
                    type: 'root',
                    children: {
                        none: {
                            type: 'no-nbt'
                        },
                        '$../block/group/command_block.json': {
                            ref: '../block/command_block.json'
                        },
                        'minecraft:banner': {
                            ref: '../block/banner.json'
                        },
                        'minecraft:beacon': {
                            ref: '../block/beacon.json'
                        }
                    }
                }
            }
            it('Should return error when current schema is not for compound tag', () => {
                const parser = new NbtTagArgumentParser('compound', 'blocks', 'minecraft:banner/list', schemas)
                const reader = new StringReader('{ foo: 1b }')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtCompoundTag(
                    {
                        foo: getNbtByteTag(1)
                    }
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 0, end: 11 },
                    'expected a list tag instead of a compound tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error for unexpected keys in a compound tag', () => {
                const parser = new NbtTagArgumentParser('compound', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('{ foo: 1b }')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtCompoundTag(
                    {
                        foo: getNbtByteTag(1)
                    }
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 2, end: 5 },
                    'unexpected key ‘foo’',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should allow additional keys in a compound tag', () => {
                const parser = new NbtTagArgumentParser('compound', 'blocks', 'minecraft:beacon', schemas)
                const reader = new StringReader('{ foo: 1b }')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtCompoundTag(
                    {
                        foo: getNbtByteTag(1)
                    }
                ))
                assert.deepStrictEqual(errors, [])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should validate values in a compound tag', () => {
                const parser = new NbtTagArgumentParser('compound', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('{ Base: 1b }')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtCompoundTag(
                    {
                        Base: getNbtByteTag(1)
                    }
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 8, end: 10 },
                    'expected an int tag instead of a byte tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error when current schema is not for list tag', () => {
                const parser = new NbtTagArgumentParser('list', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('[]')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtListTag(
                    []
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'expected a compound tag instead of a list tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should validate values in a list tag', () => {
                const parser = new NbtTagArgumentParser('list', 'blocks', 'minecraft:banner/listOfInts', schemas)
                const reader = new StringReader('[1b]')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtListTag(
                    [
                        getNbtByteTag(1)
                    ]
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 1, end: 3 },
                    'expected an int tag instead of a byte tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error when current schema is not for byte array tag', () => {
                const parser = new NbtTagArgumentParser('byte_array', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('[B;]')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtByteArrayTag(
                    []
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'expected a compound tag instead of a byte array tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error when current schema is not for int array tag', () => {
                const parser = new NbtTagArgumentParser('int_array', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('[I;]')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtIntArrayTag(
                    []
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'expected a compound tag instead of an int array tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error when current schema is not for long array tag', () => {
                const parser = new NbtTagArgumentParser('long_array', 'blocks', 'minecraft:banner', schemas)
                const reader = new StringReader('[L;]')
                const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, EmptyGlobalCache)
                assert.deepEqual(data, getNbtLongArrayTag(
                    []
                ))
                assert.deepStrictEqual(errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'expected a compound tag instead of a long array tag',
                    true,
                    DiagnosticSeverity.Warning
                )])
                assert.deepStrictEqual(cache, { def: {}, ref: {} })
                assert.deepStrictEqual(completions, [])
            })
        })
    })
})
