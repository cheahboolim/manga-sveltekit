<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Menu, X, Search } from 'lucide-svelte';
	import { writable, get } from 'svelte/store';

	let search = '';
	let isMobile = false;
	const mobileMenuOpen = writable(false);

	const navItems = [
		{ title: 'Random', href: '/random', special: true },
		{ title: 'Tags', href: '/p/tags', mobileTitle: 'Tags' },
		{ title: 'Parodies', href: '/p/parodies', mobileTitle: 'Parodies' },
		{ title: 'Characters', href: '/p/characters', mobileTitle: 'Characters' },
		{ title: 'Artists', href: '/p/artists', mobileTitle: 'Artists' },
		{ title: 'Groups', href: '/p/groups', mobileTitle: 'Groups' },
		{ title: 'Categories', href: '/p/categories', mobileTitle: 'Categories' },
		{ title: 'Languages', href: '/p/languages', mobileTitle: 'Languages' }
	];

	function handleSearch(event: Event) {
		event.preventDefault();
		if (search.trim()) {
			goto(`/search?q=${encodeURIComponent(search.trim())}`);
			mobileMenuOpen.set(false);
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen.set(false);
	}

	function navigateToRandom() {
		window.location.href = '/random';
		closeMobileMenu();
	}

	onMount(() => {
		const updateMobile = () => {
			isMobile = window.innerWidth < 1024; // Changed to lg breakpoint (1024px)
			// Auto-close mobile menu if switching to desktop
			if (!isMobile) {
				mobileMenuOpen.set(false);
			}
		};
		
		updateMobile();
		window.addEventListener('resize', updateMobile);

		const unsub = mobileMenuOpen.subscribe((open) => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = open ? 'hidden' : '';
			}
		});

		return () => {
			window.removeEventListener('resize', updateMobile);
			unsub();
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container mx-auto px-3 sm:px-4 lg:px-8">
		<div class="flex h-14 sm:h-16 items-center justify-between">
			{#if isMobile}
				<!-- MOBILE LAYOUT -->
				<div class="flex w-full items-center justify-between gap-2 sm:gap-3">
					<!-- Logo -->
					<div class="flex-shrink-0 min-w-0">
						<a href="/" class="font-bold text-base sm:text-lg text-foreground truncate">
							<span class="block sm:hidden">SM</span>
							<span class="hidden sm:block">SUSMANGA.COM</span>
						</a>
					</div>

					<!-- Mobile Search -->
					<div class="flex-1 min-w-0 mx-3 sm:mx-4">
						<form on:submit={handleSearch} class="relative">
							<input
								type="search"
								bind:value={search}
								placeholder="Search..."
								class="w-full rounded-full text-xs sm:text-sm placeholder:text-gray-400 bg-[#343434] text-white px-3 sm:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
							/>
							<button
								type="submit"
								class="absolute right-0.5 sm:right-1 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-white/10 text-white p-1 sm:p-1.5 rounded-full transition-colors"
								aria-label="Search"
							>
								<Search class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
							</button>
						</form>
					</div>

					<!-- Mobile Menu Button -->
					<div class="flex-shrink-0">
						<button 
							type="button" 
							class="text-foreground hover:text-foreground/80 p-1.5 sm:p-2 -m-1.5 sm:-m-2 transition-colors" 
							on:click={() => mobileMenuOpen.update(v => !v)}
							aria-label="Toggle menu"
						>
							<Menu class="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					</div>
				</div>
			{:else}
				<!-- DESKTOP LAYOUT -->
				<div class="flex w-full items-center justify-between">
					<!-- Logo -->
					<div class="flex-shrink-0">
						<a href="/" class="font-bold text-xl lg:text-2xl text-foreground">
							SUSMANGA.COM
						</a>
					</div>

					<!-- Desktop Search -->
					<div class="flex-1 max-w-md mx-8">
						<form on:submit={handleSearch} class="relative">
							<input
								type="search"
								bind:value={search}
								placeholder="Search SusManga.com"
								class="w-full rounded-full text-sm placeholder:text-gray-400 bg-[#343434] text-white px-4 py-2 pr-12 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
							/>
							<button
								type="submit"
								class="absolute right-0.5 top-1/2 transform -translate-y-1/2 bg-[#343434] hover:bg-[#e01382] text-white p-2 rounded-full transition-colors"
								aria-label="Search"
							>
								<Search class="w-3 h-3" />
							</button>
						</form>
					</div>

					<!-- Desktop Navigation -->
					<nav class="flex items-center space-x-1 lg:space-x-2">
						{#each navItems as item}
							<a href={item.href} class="flex-shrink-0">
								<button
									class={`${
										item.special
											? 'bg-[#FF1493] hover:bg-[#e01382] text-white'
											: 'text-foreground/80 hover:text-foreground hover:bg-white/5'
									} px-3 lg:px-4 py-2 rounded text-sm lg:text-base transition-colors whitespace-nowrap`}
								>
									{item.title}
								</button>
							</a>
						{/each}
					</nav>
				</div>
			{/if}
		</div>
	</div>
</header>

<!-- MOBILE MENU OVERLAY -->
{#if isMobile && $mobileMenuOpen}
	<!-- Backdrop -->
	<div 
		class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" 
		on:click={closeMobileMenu}
		on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
		tabindex="-1"
		role="button"
		aria-label="Close menu"
	></div>

	<!-- Mobile Menu Panel -->
	<div class="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-[101] bg-black/95 backdrop-blur-md border-l border-white/10">
		<div class="flex flex-col h-full">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-white/10">
				<span class="font-semibold text-white text-lg">Menu</span>
				<button 
					on:click={closeMobileMenu} 
					class="text-white hover:text-white/80 p-2 -m-2 transition-colors"
					aria-label="Close menu"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Menu Content -->
			<div class="flex-1 overflow-y-auto p-4">
				<!-- Random Button -->
				<div class="mb-6">
					<button 
						type="button"
						class="w-full bg-[#FF1493] hover:bg-[#e01382] text-white px-6 py-3 rounded-lg text-center transition-colors text-base font-medium" 
						on:click={navigateToRandom}
					>
						Random
					</button>
				</div>

				<!-- Search Section -->
				<div class="mb-6">
					<form on:submit={handleSearch} class="relative">
						<input
							type="search"
							bind:value={search}
							placeholder="Search SusManga.com"
							class="w-full rounded-lg text-base placeholder:text-gray-400 bg-[#343434] text-white px-4 py-3 pr-12 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
						/>
						<button
							type="submit"
							class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-white/10 text-white p-2 rounded-full transition-colors"
							aria-label="Search"
						>
							<Search class="w-4 h-4" />
						</button>
					</form>
				</div>

				<!-- Navigation Links -->
				<nav class="space-y-1">
					{#each navItems.slice(1) as item}
						<button
							type="button"
							class="w-full text-left text-white/90 hover:text-white hover:bg-white/5 transition-colors rounded-lg {get(page).url.pathname === item.href ? 'bg-white/10 text-white' : ''}"
							on:click={() => {
								window.location.href = item.href;
								closeMobileMenu();
							}}
						>
							<div class="px-4 py-3 text-base">
								{item.mobileTitle || item.title}
							</div>
						</button>
					{/each}
				</nav>
			</div>
		</div>
	</div>
{/if}