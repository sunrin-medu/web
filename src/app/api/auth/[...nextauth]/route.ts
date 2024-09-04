import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID ?? '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
		}),
	],
	callbacks: {
		async jwt({ token, user, account }: any) {
			if (account) {
				token.id_token = account.id_token;
			}

			return token;
		},

		async session({ session, token }: any) {
			session.id_token = token.id_token as string | undefined;

			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
