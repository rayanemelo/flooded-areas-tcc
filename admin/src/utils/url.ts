import { stringify } from "qs";

import type { Params } from "@/services/types";

/** Substitui parâmetros dinâmicos (ex: `:id`) na URL pelos valores informados. */
export function replaceParams(url: string, params: Params) {
  const urlWithParams = Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replaceAll(`:${key}`, value.toString());
  }, url);
  return urlWithParams;
}

/** Monta a URL completa com parâmetros e query string. */
export function mountUrl<ParamsType = Params, QueryType = Params>(
  baseUrl: string,
  url: string,
  params?: ParamsType,
  query?: QueryType
) {
  const urlApi = baseUrl;
  const urlWithParams = params ? replaceParams(url, params) : url;

  const filteredQuery = query
    ? Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== "")
    )
    : {};

  const queryString =
    Object.keys(filteredQuery).length > 0 ? "?" + stringify(filteredQuery) : "";

  return urlApi + urlWithParams + queryString;
}
