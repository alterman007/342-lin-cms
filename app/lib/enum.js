function isType(val) {
  return Object.values(this).indexOf(val) > -1;
}

const authLevel = {
  USER: 8,
  ADMIN: 16,
  SUPER_ADMIN: 32,
};

const loginType = {
  USER_DING: 100,
  isType,
};

module.exports = {
  loginType,
  authLevel,
};
