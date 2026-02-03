// Booking model
export class Booking {
  constructor(id, tenantId, propertyId, roomNumber, bookingAmount, depositPeriod, agreement, approved, approvedDate) {
    this.id = id;
    this.tenantId = tenantId;
    this.propertyId = propertyId;
    this.roomNumber = roomNumber;
    this.bookingAmount = bookingAmount;
    this.depositPeriod = depositPeriod; // '10days', '1month', etc.
    this.agreement = agreement;
    this.approved = approved;
    this.approvedDate = approvedDate;
  }
}