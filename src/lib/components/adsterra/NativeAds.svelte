<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Dynamically load the Adsterra script
    const script = document.createElement('script');
    script.src = 'https://a.magsrv.com/ad-provider.js';
    script.async = true;
    script.type = 'application/javascript';
    document.body.appendChild(script);

    // Ensure AdProvider array exists and push the ad config
    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  });
</script>

<ins class="eas6a97888e20" data-zoneid="5695926"></ins>

<style>
  /* Optional: make sure the ad container adapts to width */
  ins.eas6a97888e20 {
    display: block;
    width: 100%;
  }
</style>
