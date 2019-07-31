const util = require('util');
const only = require('only');
const axios = require('axios');
const User = require('../models/user');
const Auth = require('../middlewares/auth');
const { codeToUserUrl, appId, appSecret } = require('../config/dingding');
const { genDingSignature } = require('../lib');
const { jwtCookieName } = require('../config/secure');
// const { loginType } = require('../lib/enum');

class UsersCtl {
  // 验证权限
  async findSelf(ctx) {
    const { user } = ctx.state;
    const detail = await User.findByPk(user.id);
    ctx.body = only(detail, 'username scope id');
  }

  async create(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    });
    const { username, password } = ctx.request.body;
    // const user = { username, password };
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (user) {
      ctx.throw(409, 'username has been used');
    }
    const psw = await User.hashPassword(password);
    const res = await User.create({ username, password: psw });

    ctx.status = 201;
    ctx.body = only(res, 'username id');
  }

  async loginDefault(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    });
    const { username, password } = ctx.request.body;
    try {
      await User.verifyUserPassword(username, password);
    } catch (err) {
      ctx.throw(401, err.message);
    }
    const user = await User.findOne({ where: { username } });
    const token = Auth.genToken(only(user, 'username scope id'));
    ctx.body = { token };
  }

  async loginDing(ctx) {
    const { code = '' } = ctx.query;
    const timestamp = Date.now().toString();
    const signature = genDingSignature(timestamp, appSecret);
    // console.log(signature);
    // console.log(encodeURI(signature));
    const url = util.format(codeToUserUrl, appId, timestamp, encodeURIComponent(signature));
    let userInfo;
    try {
      const { data } = await axios.post(url, { tmp_auth_code: code });
      if (data.errcode) {
        throw new Error(data.errmsg);
      }
      userInfo = data.user_info;
    } catch (err) {
      ctx.throw(401, err.message);
    }
    let user = await User.getUserByOpenid(userInfo.openid);
    if (!user) {
      user = User.registerByOpenid(userInfo.openid, userInfo.nick);
    }
    const token = Auth.genToken(only(user, 'username scope id'));

    ctx.cookies.set(jwtCookieName, token);
    ctx.redirect('http://47.110.95.92/api/users');
    // ctx.body = { token };
  }
}

module.exports = new UsersCtl();
