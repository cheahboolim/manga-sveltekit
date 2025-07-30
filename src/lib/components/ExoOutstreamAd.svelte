<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://a.magsrv.com/ad-provider.js';
    script.async = true;
    script.type = 'application/javascript';
    document.body.appendChild(script);

    script.onload = () => {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    };
  });
</script>

<!-- Outstream ad container -->
<div class="fixed bottom-4 right-4 z-50 w-[320px] max-w-full">
  <ins class="eas6a97888e37 block w-full" data-zoneid="5689570"></ins>
</div>
