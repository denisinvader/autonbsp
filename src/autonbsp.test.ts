import { test } from 'node:test';
import { equal } from 'node:assert/strict';
import type { AutoNBSPConfig } from './types';
import { autoNBSP } from './autonbsp';

test('"betweenDigits" replaces whitespace between adjacent digits', () => {
    equal(autoNBSP('123 456', { betweenDigits: true }), '123 456');
    equal(autoNBSP('1 2 3 456', { betweenDigits: true }), '1 2 3 456');
    equal(autoNBSP('000 123 456 0', { betweenDigits: true }), '000 123 456 0');
    equal(autoNBSP('000', { betweenDigits: true }), '000');
    equal(autoNBSP('1    1', { betweenDigits: true }), '1 1');
    equal(autoNBSP('1     1', { betweenDigits: true }), '1 1');
    equal(autoNBSP('1  \t  1', { betweenDigits: true }), '1 1');
    equal(autoNBSP('1  \t \n\n 1', { betweenDigits: true }), '1 1');
});

test('"afterDigits: true" replaces whitespace after a digit when followed by a non-digit', () => {
    equal(autoNBSP('2 pieces', { afterDigits: true }), '2 pieces');
    equal(autoNBSP('123 456 pieces', { afterDigits: true }), '123 456 pieces');
    equal(autoNBSP('1 . 2 3 4 % 5\t\t| 234\n\np', { afterDigits: true }), '1 . 2 3 4 % 5 | 234 p');
});

test('"afterDigits: \"before-letter\"\" replaces whitespace after a digit when followed by a Unicode letter', () => {
    equal(autoNBSP('2 pieces', { afterDigits: 'before-letter' }), '2 pieces');
    equal(autoNBSP('5 猫', { afterDigits: 'before-letter' }), '5 猫');
    equal(autoNBSP('43 кг', { afterDigits: 'before-letter' }), '43 кг');
    equal(autoNBSP('123 456 pieces', { afterDigits: 'before-letter' }), '123 456 pieces');
    equal(autoNBSP('1 . 2 3 4 % 5\t\t| 234\n\np', { afterDigits: 'before-letter' }), '1 . 2 3 4 % 5\t\t| 234 p');
});

test('"prepositions" replaces whitespace after specified whole-word prepositions', () => {
    const prepositions = ['a', 'for', 'in'];

    equal(autoNBSP('a car', { prepositions }), 'a car');
    equal(autoNBSP('in word', { prepositions }), 'in word');
    equal(autoNBSP('for me', { prepositions }), 'for me');
    equal(autoNBSP('ride for a while', { prepositions }), 'ride for a while');
    equal(autoNBSP('let me in', { prepositions }), 'let me in');
    equal(autoNBSP('aka name', { prepositions }), 'aka name');
    equal(autoNBSP('  a a a _ for for for _ in _ in ', { prepositions }), '  a a a _ for for for _ in _ in ');
    equal(autoNBSP('a    \t\t car in\n\n   word', { prepositions }), 'a car in word');
});

test('supports string patterns for "prepositions"', () => {
    const prepositions = 'a|for|in';

    equal(autoNBSP('a car', { prepositions }), 'a car');
    equal(autoNBSP('in word', { prepositions }), 'in word');
    equal(autoNBSP('for me', { prepositions }), 'for me');
    equal(autoNBSP('ride for a while', { prepositions }), 'ride for a while');
    equal(autoNBSP('let me in', { prepositions }), 'let me in');
    equal(autoNBSP('aka name', { prepositions }), 'aka name');
    equal(autoNBSP('  a a a _ for for for _ in _ in ', { prepositions }), '  a a a _ for for for _ in _ in ');
    equal(autoNBSP('a    \t\t car in\n\n   word', { prepositions }), 'a car in word');
});

test('options can be combined', () => {
    const config = {
        prepositions: ['a', 'for', 'in'],
        betweenDigits: true,
        afterDigits: true,
    } satisfies AutoNBSPConfig;

    equal(autoNBSP('123 456', config), '123 456');
    equal(autoNBSP('123 pics', config), '123 pics');
    equal(autoNBSP('pics in stock', config), 'pics in stock');
    equal(autoNBSP('123 456 pics', config), '123 456 pics');
    equal(autoNBSP('123 456 pics in stock', config), '123 456 pics in stock');
});

test('"mode: \"html\"\" replaces matched whitespace with \"&nbsp;\"', () => {
    const config = {
        mode: 'html',
        prepositions: ['a', 'for', 'in'],
        betweenDigits: true,
        afterDigits: true,
    } satisfies AutoNBSPConfig;

    equal(autoNBSP('123 456 pics in stock', config), '123&nbsp;456&nbsp;pics in&nbsp;stock');
});

test('returns input unchanged when no replacement rules apply', () => {
    const config = {
        mode: 'html',
        prepositions: ['a', 'for', 'in'],
        betweenDigits: true,
        afterDigits: true,
    } satisfies AutoNBSPConfig;

    equal(autoNBSP('000 1 test string\n\twithout a config', {}), '000 1 test string\n\twithout a config');
    equal(autoNBSP('string without replacements 2.0', config), 'string without replacements 2.0');
});
