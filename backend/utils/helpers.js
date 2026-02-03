// Helpers
exports.formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

exports.calculateRentIncrease = (baseRent, years) => {
  return baseRent * Math.pow(1.05, years); // 5% increase per year
};