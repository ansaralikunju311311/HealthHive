import jwt from 'jsonwebtoken';
export const jwtToken= (user)=>
{
  return  jwt.sign({userId: user._id}, process.env.JWT_SECRET);
}
