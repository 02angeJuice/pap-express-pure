import { faker } from '@faker-js/faker'

const createRandomUser = () => {
    return {
        avatar: faker.image.avatar(),
        // birthday: faker.date.birthdate(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        sex: faker.person.sexType(),
        subscriptionTier: faker.helpers.arrayElement([
            'free',
            'basic',
            'business',
        ]),
    }
}

// module.exports = {
//   createRandomUser,
// }

export { createRandomUser }
