export interface CompactMappingX extends Array<number | Array<number>> {}

// [y, [SuperCompactMappingX]]
export interface CompactMappingY extends Array<number | CompactMappingX> {}

// [z, [SuperCompactMappingY]]
export interface CompactMappingZ extends Array<number | Array<CompactMappingY>> {}

// [SuperCompactMappingZ]
export interface CompactMapping extends Array<CompactMappingZ> {}

export type Place = { z: number; x: number; y: number }

export interface Mapping extends Array<Place> {}

export type StonePlace = { z: number; x: number; y: number; value?: string }

export interface StoneMapping extends Array<StonePlace> {}
