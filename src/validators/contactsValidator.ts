export const contactValidator = (value) => {
  const formatNumber = /^\d{4}-\d{4}/
  value = JSON.parse(value);
  if(!Array.isArray(value)) {
    throw new Error("contacts should be an array");
  }

  for(const contact of value) {
    if(!contact.hasOwnProperty("phoneNumber") || typeof contact.phoneNumber !== "string") {
      throw new Error('contacts should have the property "phoneNumber" and it should be a string')
    }

    if(!formatNumber.test(contact.phoneNumber)) {
      throw new Error('contact format invalid it should be "0000-0000"')
    }
  }
  return value;
}
