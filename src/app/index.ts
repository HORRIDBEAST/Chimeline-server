import express from "express"
import { ApolloServer } from '@apollo/server';
import bodyParser from "body-parser";
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4';
import {User} from './user'
import { GraphqlContext } from "../interfaces";
import JWTService from "../sservices/jwt";
const  initServer=async()=>{
    const app=express();
    app.use(bodyParser.json())
    app.use(cors())
    const GraphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs : `
        ${User.types}
        type Query {
        ${User.queries}
        }
        
        `,
        resolvers: {
            Query: {
                    ...User.resolvers.queries,
            },
          
        },
      });


      await GraphqlServer.start();
    app.use("/graphql",expressMiddleware(GraphqlServer))
    return app
}
export default initServer
/*
{
        context: async({req,res})=>{
        return {
            user: req.headers.authorization ?JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1]):undefined
        }
        }
    }))
        */