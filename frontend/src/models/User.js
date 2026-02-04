// User model
export class User {
  constructor(id, name, email, phone, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role; // 'owner' or 'tenant'
  }
}