import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.scss';
import '@/styles/font.scss';
import NextAuthProvider from '@/components/next-auth-provider';
import React from 'react';

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata: Metadata = {
	title: 'Sunrin MEDU',
	description: 'Metaverse',
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body className={ inter.className }>
			<NextAuthProvider>
				{ children }
			</NextAuthProvider>s
		</body>
		</html>
	);
}
