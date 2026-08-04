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

                let user = await User.findOne({
                    email: credentials.email,
                    role: { $in: ["superadmin", "admin"] }
                });

                if (!user) {
                    const SubAdmin = (await import("@/utils/models/subadmins")).default;
                    user = await SubAdmin.findOne({ email: credentials.email });
                }

                console.log("NextAuth Admin authorize - user found:", user);

                if (!user) {
                    return null;
                }

                const isMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isMatch) {
                    return null;
                }

                const role = user.role || "subadmin";

                if (role === "subadmin" && user.isActive === false) {
                    throw new Error("Your account has been deactivated.");
                }

                if (!["superadmin", "admin", "subadmin"].includes(role)) {
                    throw new Error("Only admins can log in to the admin panel.");
                }

                const payload = {
                    id: user._id.toString(),
                    name: user.username || user.fullName,
                    username: user.username || user.fullName,
                    email: user.email,
                    role: role,
                };
                console.log("NextAuth Admin authorize - returning payload:", payload);
                return payload;
            },
        }),
    ],
    secret: process.env.SECRET_KEY || process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    basePath: "/api/admin-auth",
    cookies: {
        sessionToken: {
            name: `admin-auth.session-token`,
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
            console.log("NextAuth Admin jwt callback - user:", user, "token:", token);
            if (user) {
                token.userid = user.id;
                token.username = user.username;
                token.role = user.role;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("NextAuth Admin session callback - session before:", session, "token:", token);
            if (token) {
                session.user.userid = token.userid;
                session.user.username = token.username;
                session.user.role = token.role;
                session.user.email = token.email;
            }
            console.log("NextAuth Admin session callback - session after:", session);
            return session;
        },
    },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);
