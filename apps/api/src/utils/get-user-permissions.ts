import { defineAbilityFor } from '@saas/auth'
import { userSchema } from '@saas/auth/src/models/user'
import type { Role } from '@saas/auth/src/roles'

export function getUserPermissions(
  userId: string,
  role: Role,
  organizationId?: string,
) {
  const authUser = userSchema.parse({
    id: userId,
    role,
    organizationId,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
