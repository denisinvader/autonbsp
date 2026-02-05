import type { AutoNBSPConfig } from '../types';

const preset = {
    betweenDigits: true,
    afterDigits: true,
    prepositions: [
        'а',
        'в',
        'во',
        'для',
        'за',
        'и',
        'из',
        'к',
        'ко',
        'на',
        'над',
        'не',
        'о',
        'об',
        'обо',
        'от',
        'по',
        'под',
        'при',
        'про',
        'с',
        'со',
        'у',
        'через',
    ],
} as const;

export default preset satisfies AutoNBSPConfig;
