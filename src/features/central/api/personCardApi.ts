import {
  type AccessIdentifier,
  apiCreateIdentifierCompat,
  blockIdentifier,
  type CreateIdentifierRequest,
  getIdentifiers,
  getPersons,
  type Person,
} from './personCardCompat';

export type { AccessIdentifier, CreateIdentifierRequest, Person };

export async function getPersonById(personId: string): Promise<Person> {
  const persons = await getPersons();
  const person = persons.find((item) => item.id === personId);

  if (!person) {
    throw new Error('Физическое лицо не найдено');
  }

  return person;
}

export async function getPersonIdentifiers(
  personId: string,
): Promise<AccessIdentifier[]> {
  const identifiers = await getIdentifiers();
  return identifiers.filter((item) => item.personId === personId);
}

export function createPersonIdentifier(request: CreateIdentifierRequest) {
  return apiCreateIdentifierCompat(request);
}

export function blockPersonIdentifier(identifierId: string) {
  return blockIdentifier(identifierId);
}