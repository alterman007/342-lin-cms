const jsonwebtoken = require('jsonwebtoken');
const { jwtSecretKey, jwtExpiresIn, jwtCookieName } = require('../config/secure');

class Auth {
  constructor(level = 1) {
    this.level = level;
    this.verifyAuth = this.verifyAuth.bind(this);
  }

  static genToken(obj = {}) {
    return jsonwebtoken.sign(obj, jwtSecretKey, { expiresIn: jwtExpiresIn });
  }

  static getToken(ctx) {
    const cookieToken = ctx.cookies.get(jwtCookieName);
    if (cookieToken) {
      return ctx.cookies.get(jwtCookieName);
    }
    const { authorization = '' } = ctx.headers;
    return authorization.split(' ')[1] || '';
  }

  static async verifyToken(ctx, next) {
    const token = Auth.getToken(ctx);
    try {
      ctx.state.user = jsonwebtoken.verify(token, jwtSecretKey);
    } catch (err) {
      ctx.throw(401, err.message);
    }
    await next();
  }

  async verifyAuth(ctx, next) {
    const { scope = 0 } = ctx.state.user || {};
    if (scope < this.level) {
      ctx.throw(403);
    }
    await next();
  }
}

module.exports = Auth;
