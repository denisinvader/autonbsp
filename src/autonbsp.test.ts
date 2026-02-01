import { describe, expect, test } from 'vitest';
import type { AutoNBSPConfig } from './types';
import { autoNBSP } from './autonbsp';

describe('autoNBSP', () => {
    test('"betweenDigits" replaces whitespace between adjacent digits', () => {
        expect(autoNBSP('123 456', { betweenDigits: true })).toEqual('123 456');
        expect(autoNBSP('1 2 3 456', { betweenDigits: true })).toEqual('1 2 3 456');
        expect(autoNBSP('000 123 456 0', { betweenDigits: true })).toEqual('000 123 456 0');
        expect(autoNBSP('000', { betweenDigits: true })).toEqual('000');
        expect(autoNBSP('1    1', { betweenDigits: true })).toEqual('1 1');
        expect(autoNBSP('1     1', { betweenDigits: true })).toEqual('1 1');
        expect(autoNBSP('1  \t  1', { betweenDigits: true })).toEqual('1 1');
        expect(autoNBSP('1  \t \n\n 1', { betweenDigits: true })).toEqual('1 1');
    });

    test('"afterDigits: true" replaces whitespace after a digit when followed by a non-digit', () => {
        expect(autoNBSP('2 pieces', { afterDigits: true })).toEqual('2 pieces');
        expect(autoNBSP('123 456 pieces', { afterDigits: true })).toEqual('123 456 pieces');
        expect(autoNBSP('1 . 2 3 4 % 5\t\t| 234\n\np', { afterDigits: true })).toEqual('1 . 2 3 4 % 5 | 234 p');
    });

    test('"afterDigits: \"before-letter\"\" replaces whitespace after a digit when followed by a Unicode letter', () => {
        expect(autoNBSP('2 pieces', { afterDigits: 'before-letter' })).toEqual('2 pieces');
        expect(autoNBSP('5 猫', { afterDigits: 'before-letter' })).toEqual('5 猫');
        expect(autoNBSP('43 кг', { afterDigits: 'before-letter' })).toEqual('43 кг');
        expect(autoNBSP('123 456 pieces', { afterDigits: 'before-letter' })).toEqual('123 456 pieces');
        expect(autoNBSP('1 . 2 3 4 % 5\t\t| 234\n\np', { afterDigits: 'before-letter' })).toEqual(
            '1 . 2 3 4 % 5\t\t| 234 p',
        );
    });

    test('"prepositions" replaces whitespace after specified whole-word prepositions', () => {
        const prepositions = ['a', 'for', 'in'];

        expect(autoNBSP('a car', { prepositions })).toEqual('a car');
        expect(autoNBSP('in word', { prepositions })).toEqual('in word');
        expect(autoNBSP('for me', { prepositions })).toEqual('for me');
        expect(autoNBSP('ride for a while', { prepositions })).toEqual('ride for a while');
        expect(autoNBSP('let me in', { prepositions })).toEqual('let me in');
        expect(autoNBSP('aka name', { prepositions })).toEqual('aka name');
        expect(autoNBSP('  a a a _ for for for _ in _ in ', { prepositions })).toEqual(
            '  a a a _ for for for _ in _ in ',
        );
        expect(autoNBSP('a    \t\t car in\n\n   word', { prepositions })).toEqual('a car in word');
    });

    test('supports string patterns for "prepositions"', () => {
        const prepositions = 'a|for|in';

        expect(autoNBSP('a car', { prepositions })).toEqual('a car');
        expect(autoNBSP('in word', { prepositions })).toEqual('in word');
        expect(autoNBSP('for me', { prepositions })).toEqual('for me');
        expect(autoNBSP('ride for a while', { prepositions })).toEqual('ride for a while');
        expect(autoNBSP('let me in', { prepositions })).toEqual('let me in');
        expect(autoNBSP('aka name', { prepositions })).toEqual('aka name');
        expect(autoNBSP('  a a a _ for for for _ in _ in ', { prepositions })).toEqual(
            '  a a a _ for for for _ in _ in ',
        );
        expect(autoNBSP('a    \t\t car in\n\n   word', { prepositions })).toEqual('a car in word');
    });

    test('options can be combined', () => {
        const config = {
            prepositions: ['a', 'for', 'in'],
            betweenDigits: true,
            afterDigits: true,
        } satisfies AutoNBSPConfig;

        expect(autoNBSP('123 456', config)).toEqual('123 456');
        expect(autoNBSP('123 pics', config)).toEqual('123 pics');
        expect(autoNBSP('pics in stock', config)).toEqual('pics in stock');
        expect(autoNBSP('123 456 pics', config)).toEqual('123 456 pics');
        expect(autoNBSP('123 456 pics in stock', config)).toEqual('123 456 pics in stock');
    });

    test('"mode: \"html\"\" replaces matched whitespace with \"&nbsp;\"', () => {
        const config = {
            mode: 'html',
            prepositions: ['a', 'for', 'in'],
            betweenDigits: true,
            afterDigits: true,
        } satisfies AutoNBSPConfig;

        expect(autoNBSP('123 456 pics in stock', config)).toEqual('123&nbsp;456&nbsp;pics in&nbsp;stock');
    });

    test('returns input unchanged when no replacement rules apply', () => {
        const config = {
            mode: 'html',
            prepositions: ['a', 'for', 'in'],
            betweenDigits: true,
            afterDigits: true,
        } satisfies AutoNBSPConfig;

        expect(autoNBSP('000 1 test string\n\twithout a config', {})).toEqual('000 1 test string\n\twithout a config');
        expect(autoNBSP('string without replacements 2.0', config)).toEqual('string without replacements 2.0');
    });
});
