import { faker } from "@faker-js/faker";
import { ID_TYPES } from "./types";

export function generateUser(id: string | number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName({ firstName, lastName }),
    email: faker.internet.email({ firstName, lastName }),
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
}

export function generateListOfUsers(
  limit: number,
  offset: number,
  id_type: string = ID_TYPES.plain
) {
  return Array.from({ length: limit }, (_, i) => {
    let id: string | number = i + offset + 1;

    if (id_type === ID_TYPES.uuid) {
      id = faker.string.uuid();
    } else if (id_type === ID_TYPES.objectid) {
      id = faker.database.mongodbObjectId();
    }

    return generateUser(id);
  });
}
