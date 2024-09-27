import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: 'https://github.com/diego3g.png',
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // Gerar 6 clientes, cada um com 4 compras
  const clientsData = Array.from({ length: 6 }).map(() => ({
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    city: faker.location.city(),
    state: faker.location.state(),
    street: faker.location.street(),
    purchases: {
      create: Array.from({ length: 4 }).map(() => ({
        service: faker.commerce.productName(),
        purchaseAmount: parseFloat(faker.commerce.price()),
        purchaseDate: faker.date.recent(),
        description: faker.commerce.productDescription(),
        paymentMethod: faker.finance.transactionType(),
      })),
    },
  }))

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      clients: {
        create: clientsData,
        // createMany: {
        //   data: [
        //     {
        //       name: faker.lorem.words(5),
        //       phoneNumber: faker.phone.number(),
        //       birthday: faker.date.birthdate(),
        //       email: faker.internet.email(),
        //       city: faker.location.city(),
        //       state: faker.location.state(),
        //       street: faker.location.street(),
        //     },
        //     {
        //       name: faker.lorem.words(5),
        //       phoneNumber: faker.phone.number(),
        //       birthday: faker.date.birthdate(),
        //       email: faker.internet.email(),
        //       city: faker.location.city(),
        //       state: faker.location.state(),
        //       street: faker.location.street(),
        //     },
        //     {
        //       name: faker.lorem.words(5),
        //       phoneNumber: faker.phone.number(),
        //       birthday: faker.date.birthdate(),
        //       email: faker.internet.email(),
        //       city: faker.location.city(),
        //       state: faker.location.state(),
        //       street: faker.location.street(),
        //     },
        //   ],
        // },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      clients: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      clients: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
            {
              name: faker.lorem.words(5),
              phoneNumber: faker.phone.number(),
              birthday: faker.date.birthdate(),
              email: faker.internet.email(),
              city: faker.location.city(),
              state: faker.location.state(),
              street: faker.location.street(),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
