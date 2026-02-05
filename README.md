# Auto NBSP

Automatically replace whitespace in string with non-breaking spaces (`\u00A0` or `&nbsp;`) to prevent hanging articles, prepositions and digits.

**Important:** this package does not parse or traverse AST. Using it with raw HTML or Markdown strings will likely break your content or markup.

For rich Markdown content use [remark-plugin-autonbsp](https://www.npmjs.com/package/remark-plugin-autonbsp).

## Installation

Install with npm or any other package manager:

```sh
npm install @dinvader/autonbsp
```

```sh
yarn add @dinvader/autonbsp
```

## Usage

Basic example:

```ts
import { autoNBSP } from '@dinvader/autonbsp';

const inputText = 'An example string with 6 tokens.';

const result = autoNBSP(inputText, {
    mode: 'html',
    afterDigits: true,
    prepositions: ['an', 'with'],
});

console.log(result);
// -> "An&nbsp;example string with&nbsp;6&nbsp;tokens.";
```

### Presets

Two config presets available for Russian and English languages. You can extend them for your needs.

```ts
import { autoNBSP } from '@dinvader/autonbsp';
import nbspEn from '@dinvader/autonbsp/presets/en';
import nbspRu from '@dinvader/autonbsp/presets/ru';

console.log(autoNBSP('5 items in stock', nbspEn));
// -> "5\u00A0items in\u00A0stock"

console.log(autoNBSP('5 items in stock', { ...nbspEn, prepositions: '', mode: 'html' }));
// -> "5&nbsp;items in stock"

console.log(autoNBSP('5 шт. на складе', nbspEn));
// -> "5\u00A0шт. на\u00A0складе"
```

## Configuration options

### `mode?: 'utf' | 'html'`

Defines the replacement used for matched whitespace.

- `'utf'` replaces whitespace with the Unicode non-breaking space character `'\u00A0'` or ` `.
- `'html'` replaces whitespace with the HTML entity string `'&nbsp;'`.

Default value is `'utf'`.

### `betweenDigits?: boolean`

Replace runs of whitespace that occur between two adjacent digits.

Examples:

- `"123 456"` → `"123\u00A0456"`
- `"1\t  2"` → `"1\u00A02"`

`false` by default.

### `afterDigits?: boolean | 'before-letter'`

Replace runs of whitespace that occur immediately after a digit.

- `true` replaces whitespace when followed by any non-digit character.
- `'before-letter'` replaces whitespace only when followed by a Unicode letter.

Examples:

- `"2 pieces"` → `"2\u00A0pieces"`
- `"5 %"` → `"5\u00A0%"`
- `"5 %"` → `"5 %"` with `'before-letter'` option

`false` by default.

### `prepositions?: string | string[];`

Replace runs of whitespace that occur after specified whole-word prepositions.

Prepositions may be provided as:

- an array of strings (e.g. `['a', 'in', 'for']`)
- a pipe-separated regular expression pattern (e.g. `'a|in|for'`)

Matching is case-insensitive and respects word boundaries.

## License

[MIT](LICENSE) © [Mikhail Panichev](https://mpanichev.ru)
