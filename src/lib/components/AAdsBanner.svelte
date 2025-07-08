<!-- src/lib/components/Ads/AAdsBlock.svelte -->
<script lang="ts">
  let loaded = false;
  function handleLoad() {
    loaded = true;
  }
</script>

<style>
  .skeleton {
    background-color: #1f2937; /* Tailwind dark gray */
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
</style>

<div class="w-full flex flex-col items-center justify-center my-6">
  <div class="relative" style="width: 300px; height: 250px;">
    {#if !loaded}
      <div class="skeleton absolute inset-0 rounded-md"></div>
    {/if}
    <iframe
      data-aa="2401977"
      src="https://ad.a-ads.com/2401977?size=300x250"
      style="width:300px; height:250px; border:0; padding:0; overflow:hidden; background-color:transparent;"
      on:load={handleLoad}
      class:hidden={!loaded}
    ></iframe>
  </div>

  <a
    id="frame-link"
    href="https://aads.com/campaigns/new/?source_id=2401977&source_type=ad_unit&partner=2401977"
    class="text-xs text-right mt-1 text-gray-400 hover:text-white transition"
    target="_blank"
    rel="noopener noreferrer"
  >
    Advertise here
  </a>
</div>
