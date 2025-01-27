import jwt from 'jsonwebtoken';
export const jwtToken= (user)=>
{
  return  jwt.sign({userId: user._id}, process.env.JWT_SECRET);
}
export const setToken= (user, res)=>
{
  const token = jwtToken(user);
  console.log("token from set token=====",token);
  res.cookie('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return token;
}
// export const ClearToken= (res)=>
// {
//   res.cookie('token', '', {
//     httpOnly: false,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });
// }