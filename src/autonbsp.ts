import type { AutoNBSPMode, AutoNBSPConfig } from './types';

const NBSP_LITERAL_BY_MODE: Record<AutoNBSPMode, string> = {
    html: '&nbsp;',
    utf: '\u00A0',
};

/**
 * Replaces runs of whitespace with non-breaking spaces according to configurable rules.
 */
export const autoNBSP = function autoNBSP(text: string, config?: AutoNBSPConfig): string {
    const { mode = 'utf', betweenDigits = false, afterDigits = false, prepositions } = config || {};
    const nbsp = NBSP_LITERAL_BY_MODE[mode];

    let result = text;

    if (prepositions) {
        const pattern = Array.isArray(prepositions) ? prepositions.join('|') : prepositions;
        const regex = new RegExp(`(?<=\\s|^)(${pattern})\\s+`, 'giu');

        result = result.replace(regex, (_, preposition) => `${preposition}${nbsp}`);
    }

    if (betweenDigits) {
        result = result.replace(/(?<=\d)\s+(?=\d)/giu, nbsp);
    }

    if (afterDigits) {
        if (afterDigits === 'before-letter') {
            result = result.replace(/(?<=\d)\s+(?=\p{L})/giu, nbsp);
        } else {
            result = result.replace(/(?<=\d)\s+(?=\D)/giu, nbsp);
        }
    }

    return result;
};
