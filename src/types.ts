export type AutoNBSPMode = 'utf' | 'html';

export interface AutoNBSPConfig {
    /**
     * Defines the replacement used for matched whitespace.
     *
     * - `'utf'` replaces whitespace with the Unicode non-breaking space character (`'\u00A0'`)
     * - `'html'` replaces whitespace with the HTML entity string (`'&nbsp;'`)
     *
     * @default 'utf'
     */
    mode?: AutoNBSPMode;
    /**
     * Replace runs of whitespace that occur between two adjacent digits.
     *
     * Examples:
     * - `"123 456"` → `"123\u00A0456"`
     * - `"1\t  2"` → `"1\u00A02"`
     *
     * @default false
     */
    betweenDigits?: boolean;
    /**
     * Replace runs of whitespace that occur immediately after a digit.
     *
     * - `true` replaces whitespace when followed by any non-digit character
     * - `'before-letter'` replaces whitespace only when followed by a Unicode letter (`\p{L}`)
     *
     * Examples:
     * - `"2 pieces"` → `"2\u00A0pieces"`
     * - `"5 %"` → `"5\u00A0%"`
     *
     * @default false
     */
    afterDigits?: boolean | 'before-letter';
    /**
     * Replace runs of whitespace that occur after specified whole-word prepositions.
     *
     * Prepositions may be provided as:
     * - an array of strings (e.g. `['a', 'in', 'for']`)
     * - a pipe-separated regular expression pattern (e.g. `'a|in|for'`)
     *
     * Matching is case-insensitive and respects word boundaries.
     */
    prepositions?: string | string[] | readonly string[];
}
