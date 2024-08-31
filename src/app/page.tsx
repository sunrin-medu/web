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
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			setHasSession(true);

			unityContext.send('PlayFabLoginManager', 'ReceiveLogin', session!!.user!!.name || undefined);
			unityContext.send('PlayFabLoginManager', 'ReceiveLoginEmail', session!!.user!!.email || undefined);
		} else {
			setHasSession(false);
		}
	}, [ status ]);

	return (
		<main className={ styles.main }>
			<div className={ styles.game }>
				<div className={ styles.windowBar }>
					{
						hasSession && (
							<>
								<div className={ styles.profile }>
									<div className={ styles.info }>
										<img src={ session!!.user!!.image || undefined } alt={ 'Profile Image' } width={ 32 } height={ 32 } />
										<p>{ session!!.user!!.name }</p>
									</div>
									<button className={ styles.logoutButton } onClick={ async () => {
										await signOut();
									} }>
										로그아웃
										<LuLogOut />
									</button>
								</div>
								<CgArrowsExpandRight onClick={ () => {
									console.log(unityContext);

									setIsFullscreen(!isFullscreen);
									unityContext.setFullscreen(!isFullscreen);
								} } />
							</>
						)
					}
				</div>
				<Unity unityContext={ unityContext } style={ {
					width: '100%',
					height: 'auto',
				} } />
				<div className={ styles.bottomBar } />
			</div>
		</main>
	);
}
