import jwt from 'jsonwebtoken';

export const jwtToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

export const setToken = (user, res) => {
  const token = jwtToken(user);
  console.log("token from set token=====", token);
  
  res.cookie('useraccessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  
  return token;
}

export const clearToken = (res) => {
  res.cookie('useraccessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0)
  });
}