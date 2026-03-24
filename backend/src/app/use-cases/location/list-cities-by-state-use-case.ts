import { readFileSync } from 'fs';
import path from 'path';
import { Exception } from '../../../infra/exception/exception';

type CityDTO = {
  ib: number;
  n: string;
  la: number;
  lo: number;
  uf: number;
};

type ListCitiesByStateResponse = {
  state: string;
  cities: string[];
};

const UF_CODE_BY_STATE: Record<string, number> = {
  RO: 11,
  AC: 12,
  AM: 13,
  RR: 14,
  PA: 15,
  AP: 16,
  TO: 17,
  MA: 21,
  PI: 22,
  CE: 23,
  RN: 24,
  PB: 25,
  PE: 26,
  AL: 27,
  SE: 28,
  BA: 29,
  MG: 31,
  ES: 32,
  RJ: 33,
  SP: 35,
  PR: 41,
  SC: 42,
  RS: 43,
  MS: 50,
  MT: 51,
  GO: 52,
  DF: 53,
};

let cachedCities: CityDTO[] | null = null;

function getCitiesData(): CityDTO[] {
  if (cachedCities) {
    return cachedCities;
  }

  const municipiosPath = path.resolve(process.cwd(), 'constants/municipios.json');
  const municipiosContent = readFileSync(municipiosPath, 'utf-8');

  cachedCities = JSON.parse(municipiosContent) as CityDTO[];

  return cachedCities;
}

export class ListCitiesByStateUseCase {
  async execute(state: string): Promise<ListCitiesByStateResponse> {
    const normalizedState = state.trim().toUpperCase();
    const stateCode = UF_CODE_BY_STATE[normalizedState];

    if (normalizedState.length !== 2 || !stateCode) {
      throw new Exception(400, 'UF invalida.');
    }

    try {
      const cities = getCitiesData()
        .filter((city) => city.uf === stateCode)
        .map((city) => city.n.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));

      return {
        state: normalizedState,
        cities,
      };
    } catch {
      throw new Exception(
        500,
        'Nao foi possivel buscar as cidades para a UF informada.'
      );
    }
  }
}
