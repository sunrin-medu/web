'use client';

import styles from './page.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import Image from 'next/image';

export default function Page({ params }: { params: { provider: string } }) {
	const [ hasSession, setHasSession ] = useState(false);
	const { data: session, status, update } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			setHasSession(true);
		} else {
			setHasSession(false);
		}
	}, [ status ]);

	const handleSignIn = async () => {
		await signIn(params.provider);
	};

	useEffect(() => {
		if (status === 'unauthenticated') {
			handleSignIn();
		}
	}, [ status ]);

	return (
		<div className={ styles.login }>
			<Image src={ '/logo.png' } alt={ 'Logo' } width={ 100 } height={ 100 } />
			{
				hasSession ? (
					<Success />
				) : <Loader />
			}
		</div>
	);
}

function Success() {
	const [ count, setCount ] = useState(5);

	useEffect(() => {
		const timer = setInterval(() => {
			setCount(count - 1);
		}, 1000);

		if (count === 0) {
			clearInterval(timer);
			window.close();
		}

		return () => clearInterval(timer);
	}, [ count ]);

	return (
		<div className={ styles.success }>
			<div className={ styles.confirm }>
				<h1>로그인 완료</h1>
				<p>{ count }초 뒤에 이전 페이지로 돌아갑니다!</p>
			</div>
			<button onClick={ () => {
				window.close();
			} }>창 바로 닫기
			</button>
		</div>
	);
}

