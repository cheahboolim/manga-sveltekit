<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let zoneId: string = '5695924';
  export let skeletonHeight: string = '50px';
  export let skeletonWidth: string = '300px';
  
  let isLoading = true;
  let adContainer: HTMLDivElement;
  let observer: IntersectionObserver | null = null;
  let scriptLoaded = false;

  // Extend window interface for AdProvider
  declare global {
    interface Window {
      AdProvider?: Array<{ serve: object }> & { push: (item: { serve: object }) => void };
    }
  }

  // Generate unique class name for this ad instance
  const uniqueClass = `eas6a97888e10-${Math.random().toString(36).substr(2, 9)}`;

  onMount(() => {
    // Load the ad script if not already loaded
    if (!window.AdProvider && !scriptLoaded) {
      loadAdScript();
    } else if (window.AdProvider) {
      // Script already loaded, render ad immediately
      renderAd();
    } else {
      // Script is loading, wait for it
      waitForScript();
    }

    // Set up intersection observer to detect when ad is rendered
    if (adContainer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if ad content has been inserted
            checkAdLoaded();
          }
        });
      });
      
      observer.observe(adContainer);
    }

    // Fallback timeout to hide skeleton after 10 seconds
    const timeout = setTimeout(() => {
      isLoading = false;
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  function loadAdScript() {
    scriptLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = 'https://a.magsrv.com/ad-provider.js';
    
    script.onload = () => {
      renderAd();
    };
    
    script.onerror = () => {
      console.error('Failed to load ad script');
      isLoading = false;
    };
    
    document.head.appendChild(script);
  }

  function waitForScript() {
    const checkScript = setInterval(() => {
      if (window.AdProvider) {
        clearInterval(checkScript);
        renderAd();
      }
    }, 100);

    // Stop checking after 5 seconds
    setTimeout(() => {
      clearInterval(checkScript);
      if (!window.AdProvider) {
        console.error('Ad script did not load in time');
        isLoading = false;
      }
    }, 5000);
  }

  function renderAd() {
    if (window.AdProvider) {
      window.AdProvider.push({ "serve": {} });
      
      // Check for ad content after a short delay
      setTimeout(() => {
        checkAdLoaded();
      }, 1000);
    }
  }

  function checkAdLoaded() {
    if (adContainer) {
      const adContent = adContainer.querySelector(`.${uniqueClass}`);
      if (adContent && (adContent.innerHTML.trim() || adContent.children.length > 0)) {
        isLoading = false;
      } else {
        // Check again after a short delay
        setTimeout(() => {
          const adContentRetry = adContainer.querySelector(`.${uniqueClass}`);
          if (adContentRetry && (adContentRetry.innerHTML.trim() || adContentRetry.children.length > 0)) {
            isLoading = false;
          }
        }, 2000);
      }
    }
  }
</script>

<div class="ad-wrapper" bind:this={adContainer}>
  {#if isLoading}
    <div class="skeleton" style="height: {skeletonHeight}; width: {skeletonWidth};">
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-line-1"></div>
        <div class="skeleton-line skeleton-line-2"></div>
        <div class="skeleton-line skeleton-line-3"></div>
        <div class="skeleton-text">Loading advertisement...</div>
      </div>
    </div>
  {/if}
  
  <div class="ad-container" class:hidden={isLoading}>
    <ins class="{uniqueClass}" data-zoneid="{zoneId}"></ins>
  </div>
</div>

<style>
  .ad-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ad-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .ad-container.hidden {
    display: none;
  }

  .skeleton {
    background: linear-gradient(90deg, #2a2a2a 25%, #333333 50%, #2a2a2a 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    opacity: 0.6;
    margin: 0 auto;
  }

  .skeleton-content {
    text-align: center;
    width: 60%;
  }

  .skeleton-line {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    margin-bottom: 4px;
    animation: pulse 2s infinite;
  }

  .skeleton-line-1 {
    width: 40%;
    margin: 0 auto 4px auto;
  }

  .skeleton-line-2 {
    width: 60%;
    margin: 0 auto 6px auto;
  }

  .skeleton-line-3 {
    display: none; /* Hide third line for compact design */
  }

  .skeleton-text {
    color: #666;
    font-size: 10px;
    font-weight: 400;
    opacity: 0.7;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.4;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .skeleton {
      height: 40px;
      width: 280px;
    }
    
    .skeleton-text {
      font-size: 9px;
    }
  }
</style>