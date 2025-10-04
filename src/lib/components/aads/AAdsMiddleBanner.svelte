<script>
  // Props for customization
  export let adId = '2411423';
  export let width = 320;
  export let height = 50;
  export let zIndex = 99998;
</script>

<!-- A-Ads Middle Banner - Ad ID: 2411423 -->
<div 
  id="frame"
  class="ad-banner-frame w-full flex flex-col items-center justify-center my-6" 
  style="width: {width}px; height: auto; margin: auto; z-index: {zIndex};"
>
  <iframe 
    data-aa={adId}
    src="https://ad.a-ads.com/{adId}?size={width}x{height}"
    title="Advertisement"
    style="border: 0; padding: 0; width: {width}px; height: {height}px; overflow: hidden; display: block; margin: auto; background-color: transparent;"
  ></iframe>
  
  <a
    id="frame-link"
    href="https://aads.com/campaigns/new/?source_id={adId}&source_type=ad_unit&partner={adId}"
    class="text-xs text-right mt-1 text-gray-400 hover:text-white transition"
    target="_blank"
    rel="noopener noreferrer"
  >
    Advertise here
  </a>
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