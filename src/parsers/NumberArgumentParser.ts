import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import { arrayToMessage } from '../utils/utils'

export default class NumberArgumentParser extends ArgumentParser<string> {
    identity = 'number'

    constructor(type: 'integer' | 'float' | 'double', min?: number, max?: number) {
        super()
        this.identity = type
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        throw ''
    }

    getExamples(): string[] {
        throw ''
    }
}
