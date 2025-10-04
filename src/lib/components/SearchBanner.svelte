<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Search, Clock, X } from 'lucide-svelte';

  let searchValue = '';
  let recentSearches: string[] = [];
  let showRecentSearches = false;
  let searchInput: HTMLInputElement;

  // Load recent searches from localStorage
  onMount(() => {
    const saved = localStorage.getItem('susmanga-recent-searches');
    if (saved) {
      recentSearches = JSON.parse(saved).slice(0, 5); // Limit to 5 recent searches
    }
  });

  function handleSearch(event?: Event) {
    if (event) event.preventDefault();
    
    const query = searchValue.trim();
    if (!query) return;

    // Save to recent searches
    saveRecentSearch(query);
    
    // Navigate to search results
    goto(`/search?q=${encodeURIComponent(query)}`);
    
    // Clear the input and hide suggestions
    searchValue = '';
    showRecentSearches = false;
  }

  function saveRecentSearch(query: string) {
    // Remove if already exists and add to beginning
    recentSearches = [query, ...recentSearches.filter(search => search !== query)].slice(0, 5);
    localStorage.setItem('susmanga-recent-searches', JSON.stringify(recentSearches));
  }

  function selectRecentSearch(search: string) {
    searchValue = search;
    handleSearch();
  }

  function removeRecentSearch(search: string, event: Event) {
    event.stopPropagation();
    recentSearches = recentSearches.filter(s => s !== search);
    localStorage.setItem('susmanga-recent-searches', JSON.stringify(recentSearches));
  }

  function clearAllSearches() {
    recentSearches = [];
    localStorage.removeItem('susmanga-recent-searches');
    showRecentSearches = false;
  }

  function handleInputFocus() {
    if (recentSearches.length > 0) {
      showRecentSearches = true;
    }
  }

  function handleClickOutside(event: Event) {
    if (!event.target || !(event.target as Element).closest('.search-banner-container')) {
      showRecentSearches = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="search-banner-container relative w-full max-w-4xl mx-auto mb-8">
  <!-- Main Search Banner -->
  <div class="bg-gradient-to-r from-black via-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">
    <div class="text-center mb-6">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
        Search The <span class="text-pink-500">Best Collections</span>
      </h1>
      <p class="text-gray-300 text-lg">
        Search Characters, Manga Titles, Tags, Series and Many More
      </p>
    </div>

    <!-- Search Form -->
    <form on:submit={handleSearch} class="relative">
      <div class="relative">
        <input
          bind:this={searchInput}
          bind:value={searchValue}
          on:focus={handleInputFocus}
          type="text"
          placeholder="Enter manga title, character name, artist..."
          class="w-full px-6 py-4 pl-14 pr-20 text-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300"
        />
        
        <!-- Search Icon -->
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Search class="w-6 h-6 text-gray-400" />
        </div>
        
        <!-- Search Button -->
        <button
          type="submit"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
        >
          Search
        </button>
      </div>
    </form>
  </div>

  <!-- Recent Searches Dropdown -->
  {#if showRecentSearches && recentSearches.length > 0}
    <div class="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-xl shadow-xl border border-gray-800 z-50 overflow-hidden">
      <div class="p-4 border-b border-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-300 flex items-center">
            <Clock class="w-4 h-4 mr-2" />
            Recent Searches
          </h3>
          <button
            on:click={clearAllSearches}
            class="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div class="max-h-64 overflow-y-auto">
        {#each recentSearches as search}
          <div class="w-full px-4 py-3 hover:bg-gray-800 transition-colors group flex items-center justify-between">
            <button
              on:click={() => selectRecentSearch(search)}
              class="flex items-center flex-1 text-left"
            >
              <Search class="w-4 h-4 text-gray-400 mr-3" />
              <span class="text-gray-300 group-hover:text-white">{search}</span>
            </button>
            <button
              on:click={(e) => removeRecentSearch(search, e)}
              class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-1 ml-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar for recent searches - Dark theme */
  .max-h-64::-webkit-scrollbar {
    width: 6px;
  }
  
  .max-h-64::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .max-h-64::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
  }
  
  .max-h-64::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>