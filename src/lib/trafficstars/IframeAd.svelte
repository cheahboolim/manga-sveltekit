<!-- src/lib/trafficstars/IframeAd.svelte -->
<script lang="ts">
  export let src: string = "//runative-syndicate.com/iframes2/829979a0268a4f30970ca4977a6248bc.html?extid={extid}";
  export let width: number = 300;
  export let height: number = 250;
  export let frameborder: number = 0;
  export let scrolling: "yes" | "no" | "auto" = "no";
</script>

<iframe
  {width}
  {height}
  {frameborder}
  {scrolling}
  src={src}
  title="TrafficStars Ad"
></iframe>
