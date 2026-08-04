import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/utils/models/user";
import DBConnection from "@/utils/config/db";
import NextAuth from "next-auth";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",

            async authorize(credentials) {
                await DBConnection();

                // For user portal, query User collection
                let user = await User.findOne({
                    email: credentials.email,
                });
                // Don't allow admin/subadmin roles to log in through the user portal
                if (user && ["superadmin", "subadmin", "admin"].includes(user.role)) {
                    user = null;
                }

                console.log("NextAuth authorize - user found:", user);

                // Check if user exists
                if (!user) {
                    return null;
                }

                // Check password
                const isMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isMatch) {
                    return null;
                }

                const role = user.role || "user";

                const payload = {
                    id: user._id.toString(),
                    name: user.username || user.fullName,
                    username: user.username || user.fullName,
                    email: user.email,
                    role: role,
                };
                console.log("NextAuth authorize - returning payload:", payload);
                return payload;
            },
        }),
    ],
    secret: process.env.SECRET_KEY || process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    basePath: "/api/auth",
    cookies: {
        sessionToken: {
            name: `user-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("NextAuth jwt callback - user:", user, "token:", token);
            if (user) {
                token.userid = user.id;
                token.username = user.username;
                token.role = user.role;
                token.email = user.email;




            }
            return token;
        },
        async session({ session, token }) {
            console.log("NextAuth session callback - session before:", session, "token:", token);
            if (token) {
                session.user.userid = token.userid;
                session.user.username = token.username;
                session.user.role = token.role;
                session.user.email = token.email;
            }
            console.log("NextAuth session callback - session after:", session);
            return session;
        },
    },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);