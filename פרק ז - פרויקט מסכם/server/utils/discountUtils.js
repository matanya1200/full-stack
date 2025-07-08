function getUserDiscount(role) {
  switch (role) {
    case 'admin':
      return 0.6; // 40% הנחה
    case 'worker':
      return 0.8; // 20% הנחה
    case 'storekeeper':
      return 0.8; // 20% הנחה
    default:
      return 1.0; // אין הנחה
  }
}

module.exports = { getUserDiscount };
