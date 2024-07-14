import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
import axios from 'axios'
import JWTService from '../../sservices/jwt';
import { GraphqlContext } from '../../interfaces';
interface GoogleTokenInfo {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    nbf?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
  }
  
const queries={
    verifyGoogleToken:async(parent:any, {token}:{token:string})=>{
      const gtoken=token;
        const googleOauthURL=new URL("https://oauth2.googleapis.com/tokeninfo")
        googleOauthURL.searchParams.set('id_token',gtoken)
    
        const {data}=await axios.get<GoogleTokenInfo>(googleOauthURL.toString(),{
            responseType:'json',
        })
        const user=await prisma.user.findUnique({
            where : {email:data.email},
        });
            if(!user){
                await prisma.user.create({
                    data:{
                        email:data.email,
                        firstName : data.given_name || '',
                        lastName:data.family_name ,
                        profileImageURL:data.picture ,
                    }
                })
            }
            const userInDB=await prisma.user.findUnique({where : {email:data.email},})
            if(!userInDB) throw new Error('User with Email not found')
            const usertoken= JWTService.generateTokenForUser(userInDB)
        
        return usertoken

    },
    getCurrentUser: async(parent:any ,args:any , ctx:GraphqlContext)=>{
        const id=ctx.user?.id
        // console.log(ctx)

        if(!id) return null
        const user=await prisma.user.findUnique({where : {id }})
        return user
    }
    /*
   
        */
}
export const resolvers={queries};