<script>
  // Props for customization
  export let adId = '2411423';
  export let width = 320;
  export let height = 50;
  export let zIndex = 99998;
</script>

<div 
  class="ad-banner-frame" 
  style="width: {width}px; height: auto; margin: auto; z-index: {zIndex};"
>
  <iframe 
    data-aa={adId}
    src="//ad.a-ads.com/{adId}/?size={width}x{height}"
    title="Advertisement"
    style="border: 0; padding: 0; width: {width}px; height: {height}px; overflow: hidden; display: block; margin: auto;"
  ></iframe>
</div>

<style>
  .ad-banner-frame {
    position: relative;
  }
  
  /* Optional: Add responsive behavior */
  @media (max-width: 360px) {
    .ad-banner-frame {
      width: 100% !important;
      max-width: 320px;
    }
    
    .ad-banner-frame iframe {
      width: 100% !important;
      max-width: 320px;
    }
  }
</style>