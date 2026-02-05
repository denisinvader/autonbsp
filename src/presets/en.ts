import type { AutoNBSPConfig } from '../types';

const preset = {
    betweenDigits: true,
    afterDigits: true,
    prepositions: ['a', 'an', 'the', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'to', 'with'],
} as const;

export default preset satisfies AutoNBSPConfig;
