'use client';

import styles from './page.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { LuLogOut } from 'react-icons/lu';
import { Unity, useUnityContext } from 'react-unity-webgl';
import Loader from '@/components/loader';

export default function Home() {
	const [ hasSession, setHasSession ] = useState(false);
	const [ isFullscreen, setIsFullscreen ] = useState(false);
	const { data: session, status } = useSession();

	const { unityProvider, isLoaded, sendMessage, loadingProgression, requestFullscreen } = useUnityContext({
		loaderUrl: 'unity/unity.loader.js',
		dataUrl: 'unity/unity.data',
		frameworkUrl: 'unity/unity.framework.js',
		codeUrl: 'unity/unity.wasm',
	});

	useEffect(() => {
		if (status === 'authenticated') {
			setHasSession(true);

			console.log('Loaded', unityProvider);
			sendMessage('PlayFabLoginManager', 'ReceiveLogin', session?.user?.name || undefined);
			sendMessage('PlayFabLoginManager', 'ReceiveLoginEmail', session?.user?.email || undefined);
			// unityContext.send('PlayFabLoginManagerToken', 'ReceiveLoginGoogle', (session as any).id_token || undefined);
			console.log('Data sent');
		} else {
			setHasSession(false);
		}
	}, [ status ]);

	return (
		<main className={ styles.main }>
			<div className={ styles.game }>
				<div className={ styles.windowBar }>
					{
						hasSession ? (
							<>
								<div className={ styles.profile }>
									<img src={ session!!.user!!.image || undefined } alt={ 'Profile Image' } width={ 32 }
									     height={ 32 } />
									<p>{ session!!.user!!.name }</p>
								</div>
							</>
						) : (
							<div></div>
						)
					}
					<div className={ styles.rightButtons }>
						{
							hasSession && (
								<button className={ styles.logoutButton } onClick={ async (e) => {
									e.preventDefault();
									await signOut();
								} }>
									<LuLogOut />
									눌러서 로그아웃
								</button>
							)
						}
						<CgArrowsExpandRight onClick={ () => {
							console.log(unityProvider);
							setIsFullscreen(!isFullscreen);
							requestFullscreen(!isFullscreen);
						} } className={ styles.fullscreenButton } />
					</div>
				</div>
				<Unity unityProvider={ unityProvider } style={ {
					width: '100%',
					aspectRatio: '16 / 9',
					borderRadius: '16px',
				} } />
				{
					isLoaded || (
						<div className={ styles.unityLoading }>
							<h1>Loading { parseInt(String(loadingProgression * 100)) }%</h1>
							<Loader />
						</div>
					)
				}
				<div className={ styles.bottomBar } />
			</div>
		</main>
	);
}
