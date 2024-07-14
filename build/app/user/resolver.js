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
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const axios_1 = __importDefault(require("axios"));
const jwt_1 = __importDefault(require("../../sservices/jwt"));
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const gtoken = token;
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set('id_token', gtoken);
        const { data } = yield axios_1.default.get(googleOauthURL.toString(), {
            responseType: 'json',
        });
        const user = yield prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            yield prisma.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name || '',
                    lastName: data.family_name,
                    profileImageURL: data.picture,
                }
            });
        }
        const userInDB = yield prisma.user.findUnique({ where: { email: data.email }, });
        if (!userInDB)
            throw new Error('User with Email not found');
        const usertoken = jwt_1.default.generateTokenForUser(userInDB);
        return usertoken;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        // console.log(ctx)
        if (!id)
            return null;
        const user = yield prisma.user.findUnique({ where: { id } });
        return user;
    })
    /*
   
        */
};
exports.resolvers = { queries };
