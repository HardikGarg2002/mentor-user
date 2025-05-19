import NextAuth, { getServerSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { AUTH } from "@/config";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Email does not exist");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.email) {
        // If we have a token but no user (e.g. after refresh), fetch the user from DB
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: AUTH.ROUTES.SIGN_IN,
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: AUTH.JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Export the auth function using getServerSession
export const auth = () => getServerSession(authOptions);

export async function getServerAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getUserRole() {
  const session = await getServerSession(authOptions);
  return session?.user?.role || null;
}

export default NextAuth(authOptions);
