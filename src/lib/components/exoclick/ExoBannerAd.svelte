<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Extend window interface for AdProvider
  declare global {
    interface Window {
      AdProvider?: any[];
    }
  }

  // Props for configuration
  export let zoneid = '5743196';
  export let keywords = 'keywords';
  export let sub = '123450000';
  export let blockAdTypes = '0';
  export let className = 'eas6a97888e33';

  let adContainer: HTMLDivElement;
  let scriptLoaded = false;

  onMount(() => {
    // Ensure we're in the browser environment
    if (!browser) return;

    // Check if AdProvider script is already loaded
    if (window.AdProvider) {
      initializeAd();
      return;
    }

    // Load the AdProvider script
    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = 'https://a.pemsrv.com/ad-provider.js';
    
    script.onload = () => {
      scriptLoaded = true;
      initializeAd();
    };

    script.onerror = () => {
      console.error('Failed to load ExoClick AdProvider script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup when component is destroyed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });

  function initializeAd() {
    if (!adContainer || !browser) return;

    try {
      // Initialize AdProvider if available
      if (typeof window !== 'undefined') {
        window.AdProvider = window.AdProvider || [];
        window.AdProvider.push({"serve": {}});
      }
    } catch (error) {
      console.error('Error initializing ExoClick ad:', error);
    }
  }
</script>

<div bind:this={adContainer} class="exoclick-banner-ad">
  <ins 
    class={className}
    data-zoneid={zoneid}
    data-keywords={keywords}
    data-sub={sub}
    data-block-ad-types={blockAdTypes}
  ></ins>
</div>

<style>
  .exoclick-banner-ad {
    display: block;
    width: 100%;
    text-align: center;
    margin: 1rem 0;
  }
  
  .exoclick-banner-ad ins {
    display: inline-block;
    text-decoration: none;
  }
</style>