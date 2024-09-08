'use client';

import styles from './page.module.scss';
import Unity, { UnityContext } from 'nextjs-unity-webgl';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { LuLogOut } from 'react-icons/lu';

const unityContext = new UnityContext({
	loaderUrl: 'unity/unity.loader.js',
	dataUrl: 'unity/unity.data',
	frameworkUrl: 'unity/unity.framework.js',
	codeUrl: 'unity/unity.wasm',
});

export default function Home() {
	const [ hasSession, setHasSession ] = useState(false);
	const [ isFullscreen, setIsFullscreen ] = useState(false);
	const { data: session, status, update } = useSession();
	const [ sessionData, setSessionData ] = useState();

	useEffect(() => {
		if (status === 'unauthenticated') {
			signOut();
		}
	}, []);

	useEffect(() => {
		if (status === 'authenticated') {
			setHasSession(true);

			console.log('Loaded', unityContext);
			unityContext.send('PlayFabLoginManager', 'ReceiveLogin', session?.user?.name || undefined);
			unityContext.send('PlayFabLoginManager', 'ReceiveLoginEmail', session?.user?.email || undefined);
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
									<div className={ styles.info }>
										<img src={ session!!.user!!.image || undefined } alt={ 'Profile Image' } width={ 32 }
										     height={ 32 } />
										<p>{ session!!.user!!.name }</p>
									</div>
									<button className={ styles.logoutButton } onClick={ async () => {
										await signOut();
									} }>
										로그아웃
										<LuLogOut />
									</button>
								</div>
							</>
						) : (
							<div></div>
						)
					}
					<CgArrowsExpandRight onClick={ () => {
						console.log(unityContext);
						if (unityContext.unityInstance) {
							setIsFullscreen(!isFullscreen);
							unityContext.setFullscreen(!isFullscreen);
						}
					} } />
				</div>
				<Unity unityContext={ unityContext } style={ {
					width: '100%',
					aspectRatio: '16 / 9',
				} } />
				<div className={ styles.bottomBar } />
			</div>
			<button onClick={ () => {
				console.log(session!!.user!!, status);
			} }>Log Session
			</button>
		</main>
	);
}
