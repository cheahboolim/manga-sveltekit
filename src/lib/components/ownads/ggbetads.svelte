<script lang="ts">
  export let href: string = 'https://ggbetbestoffer.com/l/665aad1a09354e53af029ab2';
  export let image: string = 'https://cdn.susmanga.com/ads/cover.png';
</script>

<a href={href} target="_blank" rel="noopener noreferrer" class="block w-[300px] h-[250px]">
  <div class="w-full h-full bg-[#0b0f12] rounded-xl shadow-lg overflow-hidden flex flex-col justify-between border border-gray-700 cursor-pointer transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <!-- Image -->
    <div class="flex-1 overflow-hidden relative h-[125px]">
      <img 
        src={image} 
        alt="GGBet Bonus Offer" 
        class="w-full h-full object-cover object-top" 
        on:error={(e) => {
          console.log('Image failed to load:', image);
          e.currentTarget.src = 'https://cdn.susmanga.com/alanding/7%20-%20meme/cover.jpg';
        }}
      />
    </div>

    <!-- Text / CTA -->
    <div class="p-3 bg-[#121518] text-center h-[125px] flex flex-col justify-center">
      <p class="text-sm text-slate-200 mb-2 font-semibold">
        #1 Highest rated Gambling Site in Europe
      </p>
      <p class="text-xs text-slate-400 mb-3">
        Susmanga users gets 20% extra bonus on first deposit!
      </p>
      <span class="block w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-white font-semibold text-sm text-center">
        Claim Bonus
      </span>
    </div>
  </div>
</a>

<style>
  a { font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
</style>
