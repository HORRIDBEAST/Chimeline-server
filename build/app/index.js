"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const user_1 = require("./user");
const jwt_1 = __importDefault(require("../sservices/jwt"));
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)());
    const GraphqlServer = new server_1.ApolloServer({
        typeDefs: `
        ${user_1.User.types}
        type Query {
        ${user_1.User.queries}
        }
        
        `,
        resolvers: {
            Query: Object.assign({}, user_1.User.resolvers.queries),
        },
    });
    yield GraphqlServer.start();
    app.use("/graphql", (0, express4_1.expressMiddleware)(GraphqlServer, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
            return {
                user: req.headers.authorization ? jwt_1.default.decodeToken(req.headers.authorization.split('Bearer ')[1]) : undefined
            };
        })
    }));
    return app;
});
exports.default = initServer;
/*
{
        
    }))
        */ 
