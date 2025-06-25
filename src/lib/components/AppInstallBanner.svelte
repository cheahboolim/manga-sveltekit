<script lang="ts">
	import { onMount } from 'svelte';
	import { trackEvent } from '$lib/gtm';

	let os = 'your device';
	let deferredPrompt: Event | null = null;
	let canInstall = false;

	// Detect user OS
	function detectOS(): string {
		const ua = navigator.userAgent || navigator.vendor;
		if (/android/i.test(ua)) return 'Android';
		if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
		return 'your device';
	}

	onMount(() => {
		os = detectOS();

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
			localStorage.setItem('susmanga_installed', '1');
			trackEvent('pwa_installed', {
				category: 'PWA',
				label: 'App Installed'
			});
		});
	});

	// Trigger install prompt
	async function promptInstall() {
		if (deferredPrompt) {
			(deferredPrompt as any).prompt();
			const result = await (deferredPrompt as any).userChoice;
			console.log('[PWA] userChoice:', result);
			deferredPrompt = null;
		}
	}
</script>

<!-- Always visible banner -->
<div class="app-banner">
	<div class="content">
		<h2 class="title">❤️ Love SusManga? Get our app</h2>
		<p class="subtitle">Download app for {os}</p>

		{#if canInstall}
			<button on:click={promptInstall} class="install-btn">
				Install on {os}
			</button>
		{:else}
			<p class="note">Add to home screen from your browser menu</p>
		{/if}

		<p class="note">100% safe and verified</p>
	</div>
</div>

<style>
	.app-banner {
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

	.note {
		font-size: 0.75rem;
		color: #ccc;
		margin-top: 0.75rem;
	}

	.install-btn {
		display: inline-block;
		padding: 0.6rem 1.4rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 999px;
		color: white;
		background: linear-gradient(90deg, #ff5f8d, #ff81b0);
		box-shadow: 0 4px 12px rgba(255, 120, 180, 0.3);
		transition: all 0.2s ease-in-out;
	}
	.install-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
</style>
