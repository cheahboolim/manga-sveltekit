<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://a.magsrv.com/ad-provider.js';
    script.async = true;
    script.type = 'application/javascript';
    document.body.appendChild(script);

    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  });
</script>

<div class="banner-wrapper">
  <ins class="eas6a97888e10" data-zoneid="5695924"></ins>
</div>

<style>
  .banner-wrapper {
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically if needed */
    width: 100%;
  }

  ins.eas6a97888e10 {
    display: block;
  }
</style>
