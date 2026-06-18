

export interface CacheModel {
    limitPerDay: number,
    usedToken: number,
    active: boolean,
    lastUsed: Date,
    whenUpdate: Date
}
export const RAM_CACHE_MODELS: Record<string, CacheModel> = {};