import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("Credentials are missing");
          }
          const isEmail = credentials.identifier.includes("@");

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
            {
              method: "POST",
              body: JSON.stringify({
                username: isEmail ? "" : credentials.identifier,
                email: isEmail ? credentials.identifier : "",
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const data = await res.json();
          if (!res.ok) {
            throw new Error(
              data.non_field_errors
                ? data.non_field_errors[0]
                : "Invalid credentials"
            );
          }
          return data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw new Error(error.message || "Failed to login");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      const isAllowedToSignIn = true;
      if (!isAllowedToSignIn) {
        return false;
      }

      if (account?.provider === "google") {
        const { access_token: access, id_token: idToken } = account;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/topnotch/google/login/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: access,
                id_token: idToken,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to sign in:",
              response.status,
              response.statusText
            );
            return false;
          }

          const data = await response.json();

          if (data?.access && data?.refresh) {
            const decodedAccessToken = JSON.parse(
              Buffer.from(data.access.split(".")[1], "base64").toString("utf-8")
            );
            // Attach the access token to the user object for further use
            user.access = data.access;
            user.refresh = data.refresh;
            user.accessTokenExpires = decodedAccessToken.exp * 1000;

            return true;
          }

          console.error("Access token missing in response");
          return false;
        } catch (error) {
          console.error("Error during sign-in process:", error);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user, account }) {
      if (account) {
        // Set Google tokens from the account object (if available)
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || user?.refresh;
        token.idqToken = account.idToken;
        token.provider = account.provider;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : undefined;
      }

      if (user && user.access) {
        return {
          ...token,
          access: user.access,
          refresh: user.refresh,
          email: user.user?.email ?? user?.email ?? null,
          name: user.user?.username ?? user?.name ?? null,
          image: user.image ?? null,
          accessTokenExpires: user.accessTokenExpires,
        };
      }
      const tokenExpireAt = token.accessTokenExpires as number;
      if (Date.now() < (tokenExpireAt as number)) {
        return token;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
          {
            method: "POST",
            body: JSON.stringify({ refresh: token.refresh }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();

        return {
          ...token,
          access: data.access,
          accessTokenExpires:
            JSON.parse(
              Buffer.from(data.access.split(".")[1], "base64").toString("utf-8")
            ).exp * 1000,
          refresh: data.refresh || token.refresh,
        };
      } catch (error) {
        console.error("Cannot Refresh Token", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      session.access = token.access as string;
      session.refresh = token.refresh as string;
      session.user.name = token.name ?? "";
      session.user.email = token.email ?? "";
      return session;
    },
  },
};

export default NextAuth(authOptions);
