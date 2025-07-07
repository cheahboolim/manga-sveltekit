<script lang="ts">
  import { onMount } from 'svelte';
  let adContainer: HTMLDivElement;

  onMount(() => {
    const scriptConfig = document.createElement('script');
    scriptConfig.type = 'text/javascript';
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '10a74cde0d7fb9b8aadb4042bc6d9ce8',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const scriptSrc = document.createElement('script');
    scriptSrc.type = 'text/javascript';
    scriptSrc.src = '//www.highperformanceformat.com/10a74cde0d7fb9b8aadb4042bc6d9ce8/invoke.js';
    scriptSrc.async = true;

    if (adContainer) {
      adContainer.appendChild(scriptConfig);
      adContainer.appendChild(scriptSrc);
    }

    return () => {
      if (adContainer) adContainer.innerHTML = '';
    };
  });
</script>

<!-- ✅ Reserve height to prevent layout shifts -->
<div class="w-full flex justify-center">
  <div
    bind:this={adContainer}
    class="w-[300px] h-[250px] overflow-hidden relative bg-neutral-900"
  ></div>
</div>
