// Tenant model
export class Tenant {
  constructor(id, userId, propertyId, profilePhoto, aadharNumber, aadharPhoto, mobile, alternateMobile, lastAddress, profession, jobLocation, vehicle, maritalStatus, livingWith, workingHours, vegetarian, drink, payments) {
    this.id = id;
    this.userId = userId;
    this.propertyId = propertyId;
    this.profilePhoto = profilePhoto;
    this.aadharNumber = aadharNumber;
    this.aadharPhoto = aadharPhoto;
    this.mobile = mobile;
    this.alternateMobile = alternateMobile;
    this.lastAddress = lastAddress;
    this.profession = profession;
    this.jobLocation = jobLocation;
    this.vehicle = vehicle;
    this.maritalStatus = maritalStatus;
    this.livingWith = livingWith; // 'family' or 'alone'
    this.workingHours = workingHours;
    this.vegetarian = vegetarian;
    this.drink = drink;
    this.payments = payments;
  }
}