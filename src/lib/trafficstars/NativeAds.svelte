<!-- src/lib/trafficstars/NativeAds.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  export let elementId: string = "ts_ad_native_y9tjr";
  export let spot: string = "f99cf1bc8bc84b0fa9023689ec2f9fc2";
  export let cols: number = 2;
  export let rows: number = 1;
  export let title: string = "Suggested for you";
  export let titlePosition: "left" | "right" | "center" = "left";
  export let adsByPosition: "left" | "right" | "center" = "right";

  // Allow custom breakpoints
  export let breakpoints: { cols: number; width: number }[] = [
    { cols: 2, width: 770 }
  ];

  onMount(() => {
    // Load the external TrafficStars script if not already present
    if (!document.querySelector('script[src="//cdn.runative-syndicate.com/sdk/v1/n.js"]')) {
      const script = document.createElement("script");
      script.src = "//cdn.runative-syndicate.com/sdk/v1/n.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initNativeAd();
      };
    } else {
      initNativeAd();
    }

    function initNativeAd() {
      // @ts-ignore – provided by TrafficStars SDK
      if (typeof NativeAd !== "undefined") {
        // @ts-ignore
        NativeAd({
          element_id: elementId,
          spot,
          type: "label-under",
          cols,
          rows,
          title,
          titlePosition,
          adsByPosition,
          breakpoints
        });
      }
    }
  });
</script>

<div id={elementId}></div>
