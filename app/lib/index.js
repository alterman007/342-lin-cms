const crypto = require('crypto');

function genDingSignature(timestamp, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp);
  return hmac.digest('base64');
}

module.exports = {
  genDingSignature,
};
