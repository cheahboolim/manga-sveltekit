<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    // Prevent duplicate script injection
    if (!document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      script.type = 'application/javascript';
      document.body.appendChild(script);

      script.onload = () => {
        (window.AdProvider = window.AdProvider || []).push({ serve: {} });
      };
    } else {
      // Script already loaded, just serve the ad
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    }
  });
</script>

<div class="fixed bottom-4 right-4 z-50 w-[320px] max-w-full">
  <ins class="eas6a97888e31 block w-full" data-zoneid="5684168"></ins>
</div>
