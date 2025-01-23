import jwt from 'jsonwebtoken';
export const accessToken= (user)=>
{
  return  jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET);
}
export const refreshToken= (user)=>
{
  return  jwt.sign({userId: user._id}, process.env.REFRESH_TOKEN_SECRET);
}