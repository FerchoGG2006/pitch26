/**
 * Lógica del Motor de Calificaciones (Rating Engine)
 * Calcula el impacto en el rating de un jugador basado en eventos de partido.
 */

export type MatchEventType = 
    | 'GOAL' 
    | 'ASSIST' 
    | 'YELLOW_CARD' 
    | 'RED_CARD' 
    | 'CLEAN_SHEET' 
    | 'SAVES' 
    | 'MVP';

export interface MatchEvent {
    playerId: string;
    type: MatchEventType;
    value?: number; // Ej: número de atajadas
}

export const calculateRatingDelta = (event: MatchEvent): number => {
    switch (event.type) {
        case 'GOAL':
            return 5;
        case 'ASSIST':
            return 3;
        case 'MVP':
            return 4;
        case 'CLEAN_SHEET':
            return 2;
        case 'SAVES':
            return (event.value || 0) >= 5 ? 2 : 1;
        case 'YELLOW_CARD':
            return -1;
        case 'RED_CARD':
            return -5;
        default:
            return 0;
    }
}
