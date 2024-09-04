import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.scss';
import '@/styles/font.scss';
import NextAuthProvider from '@/components/next-auth-provider';
import React from 'react';

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata: Metadata = {
	metadataBase: new URL('http://localhost:3000'),
	title: 'MEDU',
	description: 'K 디지털 콘텐츠 메타버스 경진대회 - Sunrin MEDU 팀',
	openGraph: {
		title: 'MEDU',
		description: 'K 디지털 콘텐츠 메타버스 경진대회 - Sunrin MEDU 팀',
		type: 'website',
		locale: 'ko_KR',
		siteName: 'Sunrin MEDU',
		images: [ '/logo.png' ],
		url: 'https://sunrinmedu.life/',
	},
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
			</NextAuthProvider>
		</body>
		</html>
	);
}
