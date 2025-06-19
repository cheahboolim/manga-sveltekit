<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import { Menu } from 'lucide-svelte';

	import { writable, get } from 'svelte/store';

	let search = '';
	let isMobile = false;

	const navItems = [
		{ title: 'Upload', href: '/upload', special: true },
		{ title: 'A-Z Tags', href: '/p/tags/a/1' }
	];

	function handleSearch(event: Event) {
		event.preventDefault();
		if (search.trim()) {
			goto(`/search?q=${encodeURIComponent(search.trim())}`);
		}
	}

	// detect mobile screen size
	onMount(() => {
		const updateMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		updateMobile();
		window.addEventListener('resize', updateMobile);
		return () => window.removeEventListener('resize', updateMobile);
	});
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container h-16 flex items-center justify-between px-2">
		{#if isMobile}
			<!-- ✅ MOBILE LAYOUT -->
			<div class="flex w-full items-center justify-between gap-2">
				<!-- Left - Logo -->
				<a href="/" class="w-[10%] min-w-[40px] flex justify-start font-bold text-xl text-foreground">SM</a>

				<!-- Center - Search -->
				<form on:submit|preventDefault={handleSearch} class="w-[80%] flex justify-center">
					<input
						type="search"
						bind:value={search}
						placeholder="Search SusManga.com"
						class="w-full rounded-full text-sm placeholder:text-gray-500/70 bg-card text-foreground px-4 py-2"
					/>
				</form>

				<!-- Right - Menu -->
				<div class="w-[10%] flex justify-end">
					<button
						type="button"
						class="text-foreground"
						on:click={() => document.getElementById('mobile-nav')?.classList.toggle('hidden')}
					>
						<Menu class="h-5 w-5" />
					</button>
				</div>
			</div>

			<!-- Mobile Nav Drawer -->
			<div id="mobile-nav" class="hidden absolute top-16 right-0 bg-card shadow-md w-48 p-4 z-40">
				<nav class="grid gap-4 mt-4 text-lg font-medium">
					{#each navItems as item}
						<a
							href={item.href}
							class="block hover:text-foreground/80 {get(page).url.pathname === item.href ? 'text-foreground' : 'text-foreground/60'}"
						>
							{#if item.special}
								<div class="bg-[#FF1493] hover:bg-[#e01382] text-white px-3 py-1 rounded text-center">
									{item.title}
								</div>
							{:else}
								{item.title}
							{/if}
						</a>
					{/each}
				</nav>
			</div>
		{:else}
			<!-- ✅ DESKTOP LAYOUT -->
			<div class="flex w-full items-center justify-between">
				<!-- Left - Logo -->
				<a href="/" class="font-bold text-xl text-foreground">SUSMANGA.COM</a>

				<!-- Center - Search -->
				<form on:submit|preventDefault={handleSearch} class="mx-4 flex-1 max-w-lg flex justify-center">
					<input
						type="search"
						bind:value={search}
						placeholder="Search SusManga.com"
						class="w-full rounded-full text-sm placeholder:text-gray-500/70 bg-card text-foreground px-4 py-2"
					/>
				</form>

				<!-- Right - Buttons -->
				<div class="flex items-center space-x-2">
					<a href="/upload">
						<button class="bg-[#FF1493] hover:bg-[#e01382] text-white px-4 py-2 rounded text-sm">Upload</button>
					</a>
					<a href="/p/tags/a/1">
						<button class="text-foreground/80 hover:text-foreground px-4 py-2 rounded text-sm">A-Z Tags</button>
					</a>
				</div>
			</div>
		{/if}
	</div>
</header>
