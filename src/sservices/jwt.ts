import { prisma } from "../clients/db";
import jwt from 'jsonwebtoken';
import {User} from '@prisma/client'
const JWT_SECRET = 'rajas1223';
import { JWTUser } from "../interfaces";
class JWTService {
  public static async generateTokenForUser(user:User ): Promise<string> {
  

    if (!user) {
      throw new Error("User not found");
    }

    const payload:JWTUser = {
      id: user?.id,
      email: user?.email,
    };

    const token = jwt.sign(payload, JWT_SECRET);
    return token ;
  }
  public static decodeToken(token:string){
    try{
      return jwt.verify(token,JWT_SECRET) as JWTUser
    }
catch{
  return null;
}
  }
  /*
  
  */
}

export default JWTService;
