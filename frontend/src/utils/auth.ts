export const isTokenExpired = (refreshTokenExpireAt: String | null): boolean => {
  if (!refreshTokenExpireAt) return true;

  let expireDate: Date;

  if (typeof refreshTokenExpireAt === 'string') {
    expireDate = new Date(refreshTokenExpireAt);
  } else {
    expireDate = refreshTokenExpireAt;
  }

  return Date.now() >= expireDate.getTime();
};
