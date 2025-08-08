<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Load Adsterra script dynamically
    const script = document.createElement('script');
    script.src = 'https://a.magsrv.com/ad-provider.js';
    script.async = true;
    script.type = 'application/javascript';
    document.body.appendChild(script);

    // Ensure AdProvider is available and push ad config
    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  });
</script>

<ins class="eas6a97888e10" data-zoneid="5695924"></ins>

<style>
  /* Optional styling to make sure the banner fits container */
  ins.eas6a97888e10 {
    display: block;
    width: 100%;
  }
</style>
