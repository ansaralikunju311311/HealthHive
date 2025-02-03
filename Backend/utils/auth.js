import jwt from 'jsonwebtoken';
export const setToken = (user)=>{
  console.log("set token")
  return jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
}
