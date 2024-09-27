import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { createClient } from './routes/clients/create-client'
import { deleteClient } from './routes/clients/delete-client'
import { getClient } from './routes/clients/get-client'
import { getClients } from './routes/clients/get-clients'
import { updateClient } from './routes/clients/update-client'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invites'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { removeMember } from './routes/members/remove-member'
import { updateMember } from './routes/members/update-member'
import { getActiveCustomers } from './routes/metrics/get-active-customers'
import { getNewCustomersByPeriod } from './routes/metrics/get-new-customers-by-period'
import { getPurchasesByPeriod } from './routes/metrics/get-purchases-by-period'
import { getRevenueByPeriod } from './routes/metrics/get-revenue-by-period'
import { getTopClients } from './routes/metrics/get-top-clients'
import { getTopServices } from './routes/metrics/get-top-services'
import { getTotalCustomers } from './routes/metrics/get-total-custumer'
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { updateOrganization } from './routes/orgs/update-organization'
import { createProduct } from './routes/product/create-product'
import { deleteProduct } from './routes/product/delete-product'
import { getProducts } from './routes/product/get-products'
import { createPurchase } from './routes/purchases/create-purchase'
import { deletePurchase } from './routes/purchases/delete-purchase'
import { getAllPurchases } from './routes/purchases/get-all-purchases'
import { getPurchase } from './routes/purchases/get-purchase'
import { getPurchases } from './routes/purchases/get-purchases'
import { updatePurchase } from './routes/purchases/update-purchase'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
// https://github.com/login/oauth/authorize?client_id=Ov23lizKiW8Qr5ktQyCb&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email

// Authenticate
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(createAccount)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

// Organizatons
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

// Clients
app.register(createClient)
app.register(deleteClient)
app.register(getClients)
app.register(getClient)
app.register(updateClient)

// Members
app.register(updateMember)
app.register(removeMember)

// Invites
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

// Purchases
app.register(createPurchase)
app.register(deletePurchase)
app.register(updatePurchase)
app.register(getAllPurchases)
app.register(getPurchase)
app.register(getPurchases)

// Metrics
app.register(getTopServices)
app.register(getTopClients)
app.register(getPurchasesByPeriod)
app.register(getRevenueByPeriod)
app.register(getNewCustomersByPeriod)
app.register(getTotalCustomers)
app.register(getActiveCustomers)

app.register(createProduct)
app.register(getProducts)
app.register(deleteProduct)

app.register(fastifyCors)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('Http server runnig 🚀')
})
