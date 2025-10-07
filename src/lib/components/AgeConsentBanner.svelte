<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let showBanner = false;
	let hasConsented = false;
	let isClient = false;

	onMount(() => {
		isClient = true;
		// Check if user has already consented
		const consent = localStorage.getItem('susmanga_18_consent');
		if (consent === 'accepted') {
			hasConsented = true;
		} else {
			showBanner = true;
		}
	});

	function acceptConsent() {
		localStorage.setItem('susmanga_18_consent', 'accepted');
		hasConsented = true;
		showBanner = false;
	}

	function rejectConsent() {
		// Redirect to blueballs.lol
		window.location.href = 'https://blueballs.lol';
	}
</script>

{#if isClient && showBanner && !hasConsented}
	<!-- Consent Banner Overlay -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
		<div class="mx-4 max-w-md rounded-lg bg-gray-900 p-6 shadow-2xl border border-gray-700">
			<div class="text-center">
				<div class="mb-4">
					<h2 class="text-2xl font-bold text-white mb-2">Age Verification</h2>
					<p class="text-gray-300 text-sm leading-relaxed">
						This website contains adult content intended for users 18 years of age and older.
						By entering this site, you certify that you are at least 18 years old and agree to our terms of service.
					</p>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						on:click={acceptConsent}
						class="rounded-lg bg-pink-600 px-6 py-2 text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
					>
						I am 18+ - Enter Site
					</button>

					<button
						on:click={rejectConsent}
						class="rounded-lg bg-gray-600 px-6 py-2 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
					>
						I am under 18 - Leave Site
					</button>
				</div>

				<div class="mt-4 text-xs text-gray-400">
					By entering, you agree to our <a href="/p/terms" class="text-pink-400 hover:text-pink-300 underline">Terms of Service</a> and <a href="/p/privacy" class="text-pink-400 hover:text-pink-300 underline">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
{/if}