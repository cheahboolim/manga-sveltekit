<script lang="ts">
	import { onMount } from 'svelte';
	import { trackEvent } from '$lib/gtm';

	let os = 'your device';
	let deferredPrompt: Event | null = null;
	let canInstall = false;
	let showBanner = true;
	let isAlreadyInstalled = false;

	// Detect user OS
	function detectOS(): string {
		const ua = navigator.userAgent || navigator.vendor;
		if (/android/i.test(ua)) return 'Android';
		if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
		if (/Windows/.test(ua)) return 'Windows';
		if (/Mac/.test(ua)) return 'Mac';
		return 'your device';
	}

	// Check if PWA is already installed
	function checkIfInstalled(): boolean {
		// Check if already installed via localStorage
		if (typeof localStorage !== 'undefined' && localStorage.getItem('susmanga_installed') === '1') {
			return true;
		}
		
		// Check if running in standalone mode (PWA is installed)
		if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
			return true;
		}
		
		// Check for iOS PWA
		if (('standalone' in window.navigator) && (window.navigator as any).standalone) {
			return true;
		}
		
		return false;
	}

	// Check if user has dismissed banner recently
	function checkIfDismissed(): boolean {
		if (typeof localStorage === 'undefined') return false;
		const dismissedAt = localStorage.getItem('susmanga_banner_dismissed');
		if (!dismissedAt) return false;
		
		// Show again after 7 days
		const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
		return parseInt(dismissedAt) > sevenDaysAgo;
	}

	onMount(() => {
		os = detectOS();
		isAlreadyInstalled = checkIfInstalled();
		
		// Don't show banner if already installed or recently dismissed
		if (isAlreadyInstalled || checkIfDismissed()) {
			showBanner = false;
			return;
		}

		// Prepare install prompt if supported
		window.addEventListener('beforeinstallprompt', (e) => {
			console.log('[PWA] beforeinstallprompt triggered');
			e.preventDefault();
			deferredPrompt = e;
			canInstall = true;
		});

		// Track install event
		window.addEventListener('appinstalled', () => {
			console.log('[PWA] appinstalled fired');
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('susmanga_installed', '1');
			}
			trackEvent('pwa_installed', {
				category: 'PWA',
				label: 'App Installed'
			});
			showBanner = false;
		});
	});

	// Trigger install prompt
	async function promptInstall() {
		if (deferredPrompt) {
			trackEvent('pwa_install_prompt_clicked', {
				category: 'PWA',
				label: 'Install Button Clicked'
			});
			
			(deferredPrompt as any).prompt();
			const result = await (deferredPrompt as any).userChoice;
			console.log('[PWA] userChoice:', result);
			
			if (result.outcome === 'accepted') {
				trackEvent('pwa_install_accepted', {
					category: 'PWA',
					label: 'Install Accepted'
				});
			} else {
				trackEvent('pwa_install_dismissed', {
					category: 'PWA',
					label: 'Install Dismissed'
				});
			}
			
			deferredPrompt = null;
			canInstall = false;
		}
	}

	// Handle banner dismissal
	function dismissBanner() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('susmanga_banner_dismissed', Date.now().toString());
		}
		trackEvent('pwa_banner_dismissed', {
			category: 'PWA',
			label: 'Banner Dismissed'
		});
		showBanner = false;
	}

	// Get OS-specific instructions
	function getInstallInstructions(os: string): string {
		switch (os) {
			case 'iOS':
				return 'Tap Share → "Add to Home Screen"';
			case 'Android':
				return 'Tap Menu → "Add to Home Screen"';
			default:
				return 'Add to home screen from your browser menu';
		}
	}
</script>

{#if showBanner && !isAlreadyInstalled}
	<!-- Always visible banner -->
	<div class="app-banner">
		<button class="dismiss-btn" on:click={dismissBanner} aria-label="Dismiss banner">
			✕
		</button>
		
		<div class="content">
			<h2 class="title">❤️ Love SusManga? Get our app!</h2>
			<p class="subtitle">Download app for {os}</p>

			{#if canInstall}
				<button on:click={promptInstall} class="install-btn">
					📱 Install on {os}
				</button>
			{:else}
				<p class="instructions">{getInstallInstructions(os)}</p>
			{/if}

			<p class="note">
				🔒 100% safe and verified • 
				⚡ Faster loading • 
				🔔 Push notifications
			</p>
		</div>
	</div>
{/if}

<style>
	.app-banner {
		position: relative;
		margin: 1.5rem auto;
		padding: 1.5rem;
		border: 2px solid white;
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(6px);
		color: white;
		max-width: 640px;
		text-align: center;
	}

	.dismiss-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.75rem;
		background: none;
		border: none;
		color: #ccc;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.dismiss-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 0.75rem;
	}

	.instructions {
		font-size: 0.9rem;
		color: #ffd700;
		margin: 0.75rem 0;
		padding: 0.5rem;
		background-color: rgba(255, 215, 0, 0.1);
		border-radius: 8px;
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	.note {
		font-size: 0.75rem;
		color: #ccc;
		margin-top: 0.75rem;
		line-height: 1.4;
	}

	.install-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 999px;
		color: white;
		background: linear-gradient(90deg, #ff5f8d, #ff81b0);
		box-shadow: 0 4px 12px rgba(255, 120, 180, 0.3);
		transition: all 0.2s ease-in-out;
		border: none;
		cursor: pointer;
	}
	
	.install-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(255, 120, 180, 0.4);
	}

	.install-btn:active {
		transform: translateY(0);
	}
</style>