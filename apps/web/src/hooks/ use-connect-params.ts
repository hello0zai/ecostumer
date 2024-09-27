import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

export function useConnectParams(initialCountryCode?: string) {
  const [params, setParams] = useQueryStates({
    step: parseAsStringLiteral(['connect', 'account']),
    countryCode: parseAsString.withDefault(initialCountryCode ?? ''),
    token: parseAsString,
    q: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    error: parseAsString,
    ref: parseAsString,
    details: parseAsString,
  })

  return {
    ...params,
    setParams,
  }
}
