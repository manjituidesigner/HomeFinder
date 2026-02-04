// Property model
export class Property {
  constructor(id, ownerId, title, description, images, location, rooms, type, inclusions, rentPrice, extraExpenses, address, contact) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.description = description;
    this.images = images;
    this.location = location;
    this.rooms = rooms;
    this.type = type; // '3bhk', '2bhk', etc.
    this.inclusions = inclusions;
    this.rentPrice = rentPrice;
    this.extraExpenses = extraExpenses;
    this.address = address;
    this.contact = contact;
  }
}