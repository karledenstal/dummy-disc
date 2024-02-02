import { faker } from "@faker-js/faker";
import { db } from "./db";
import * as schemas from "./schema";

await db.insert(schemas.users_table).values(
  Array(1000)
    .fill(0)
    .map((_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        id: i + 1,
        uuid: faker.string.uuid(),
        objectid: faker.database.mongodbObjectId(),
        name: firstName + " " + lastName,
        username: faker.internet.userName({ firstName, lastName }),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          zipCode: faker.location.zipCode(),
          geo: {
            lat: faker.location.latitude(),
            lng: faker.location.longitude(),
          },
        },
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
      };
    })
);
