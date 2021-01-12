export default () => ({
  TIMEOUT: process.env.JWT_TIMEOUT, // 12ชั่งโมง = 12x60x60 วินาที
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  VALIDATE_KEY: process.env.JWT_VALIDATE_KEY,
});
