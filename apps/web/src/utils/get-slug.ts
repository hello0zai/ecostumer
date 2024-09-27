import { getCookie } from 'cookies-next'

import { getCurrentOrg } from '../auth/auth'

export async function getCurrentSlug() {
  return getCurrentOrg() || getCookie('org')
}
