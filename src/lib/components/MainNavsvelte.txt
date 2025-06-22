<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Menu, X } from 'lucide-svelte';
	import { writable, get } from 'svelte/store';

	let search = '';
	let isMobile = false;
	const mobileMenuOpen = writable(false);

	const navItems = [
		{ title: 'Upload', href: '/p/upload', special: true },
		{ title: 'Tags', href: '/p/tags', mobileTitle: 'Browse Tags' },
		{ title: 'Parodies', href: '/p/parodies', mobileTitle: 'Browse Parodies' },
		{ title: 'Characters', href: '/p/characters', mobileTitle: 'Browse Characters' }
	];

	function handleSearch(event: Event) {
		event.preventDefault();
		if (search.trim()) {
			goto(`/search?q=${encodeURIComponent(search.trim())}`);
			mobileMenuOpen.set(false); // close menu after search
		}
	}

	onMount(() => {
		const updateMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		updateMobile();
		window.addEventListener('resize', updateMobile);

		const unsub = mobileMenuOpen.subscribe((open) => {
			document.body.style.overflow = open ? 'hidden' : '';
		});

		return () => {
			window.removeEventListener('resize', updateMobile);
			unsub();
			document.body.style.overflow = '';
		};
	});
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container h-16 flex items-center justify-between px-2">
		{#if isMobile}
			<!-- ✅ MOBILE -->
			<div class="flex w-full items-center justify-between gap-2">
				<!-- Logo -->
				<a href="/" class="w-[10%] min-w-[40px] flex justify-start font-bold text-xl text-foreground">SM</a>

				<!-- Search -->
				<form on:submit={handleSearch} class="w-[80%] flex justify-center relative">
					<input
						type="search"
						bind:value={search}
						placeholder="Search SusManga.com"
						class="w-full rounded-full text-sm placeholder:text-gray-400 bg-[#343434] text-white px-4 py-2 pr-12 border border-white"
					/>
					<button
						type="submit"
						class="absolute right-0.5 top-1/2 transform -translate-y-1/2 bg-[#343434] hover:bg-[#2a2a2a] text-white p-2 rounded-full transition-colors"
					>
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</button>
				</form>

				<!-- Hamburger -->
				<div class="w-[10%] flex justify-end">
					<button
						type="button"
						class="text-foreground"
						on:click={() => mobileMenuOpen.update((v) => !v)}
					>
						<Menu class="h-5 w-5" />
					</button>
				</div>
			</div>
		{:else}
			<!-- ✅ DESKTOP -->
			<div class="flex w-full items-center justify-between">
				<!-- Logo -->
				<a href="/" class="font-bold text-xl text-foreground">SUSMANGA.COM</a>

				<!-- Search -->
				<form on:submit={handleSearch} class="mx-4 flex-1 max-w-lg flex justify-center relative">
					<input
						type="search"
						bind:value={search}
						placeholder="Search SusManga.com"
						class="w-full rounded-full text-sm placeholder:text-gray-400 bg-[#343434] text-white px-4 py-2 pr-12 border border-white"
					/>
					<button
						type="submit"
						class="absolute right-0.5 top-1/2 transform -translate-y-1/2 bg-[#343434] hover:bg-[#e01382] text-white p-2 rounded-full transition-colors"
					>
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</button>
				</form>

				<!-- Nav Buttons -->
				<div class="flex items-center space-x-2">
					{#each navItems as item}
						<a href={item.href}>
							<button
								class={`${
									item.special
										? 'bg-[#FF1493] hover:bg-[#e01382] text-white'
										: 'text-foreground/80 hover:text-foreground'
								} px-4 py-2 rounded text-sm`}
							>
								{item.title}
							</button>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</header>

<!-- Mobile Menu Portal - Moved Outside Header -->
{#if isMobile && $mobileMenuOpen}
	<!-- Background Overlay -->
	<div class="fixed inset-0 z-[99999] bg-black/50" on:click={() => mobileMenuOpen.set(false)}></div>
	
	<!-- ✅ MOBILE DRAWER - Slides from right, 80% width -->
	<div class="fixed top-0 right-0 bottom-0 w-[80%] z-[99999] bg-black/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out" style="position: fixed !important;">
		<!-- Content Container -->
		<div class="flex flex-col h-full p-6 overflow-y-auto">
			<!-- Close Button -->
			<div class="flex justify-end mb-8 pt-2">
				<button 
					on:click={() => mobileMenuOpen.set(false)} 
					class="text-white hover:text-white/80 p-2 -m-2"
					aria-label="Close menu"
				>
					<X class="h-6 w-6" />
				</button>
			</div>

			<!-- Upload Button -->
			<div class="mb-8">
				<a
					href="/p/upload"
					class="block"
					on:click={() => mobileMenuOpen.set(false)}
				>
					<div class="bg-[#FF1493] hover:bg-[#e01382] text-white px-4 py-3 rounded-lg text-center transition-colors text-lg font-medium">
						Upload
					</div>
				</a>
			</div>

			<!-- Search Form in Mobile Menu -->
			<div class="mb-8">
				<form on:submit={handleSearch} class="w-full relative">
					<input
						type="search"
						bind:value={search}
						placeholder="Search SusManga.com"
						class="w-full rounded-full text-base placeholder:text-gray-400 bg-[#343434] text-white px-5 py-3 pr-14 border border-white focus:border-[#FFffff] focus:outline-none"
					/>
					<button
						type="submit"
						class="absolute right-0.5 top-1/2 transform -translate-y-1/2 bg-[#343434] hover:bg-[#e01382] text-white p-2.5 rounded-full transition-colors"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</button>
				</form>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 grid gap-3 text-lg font-medium">
				{#each navItems.slice(1) as item}
					<a
						href={item.href}
						class="block hover:text-white/90 transition-colors {get(page).url.pathname === item.href ? 'text-white' : 'text-white/80'}"
						on:click={() => mobileMenuOpen.set(false)}
					>
						<div class="px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
							{item.mobileTitle || item.title}
						</div>
					</a>
				{/each}
			</nav>
		</div>
	</div>
{/if}