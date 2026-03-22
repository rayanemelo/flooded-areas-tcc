export enum FloodLevel {
  LEVE = 1,
  MODERADO = 2,
  INTERDITADO = 3,
}

export type FloodLevelType = keyof typeof FloodLevel;
