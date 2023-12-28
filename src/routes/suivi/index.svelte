<script>
  import { onMount } from "svelte";

  let roadbook = [];
  var edit_Day = Object();
  edit_Day.key = "";
  edit_Day.day = "";
  edit_Day.start = "";
  edit_Day.end = "";
  edit_Day.weather = -1;
  edit_Day.difficulty = -1;
  edit_Day.night = -1;
  edit_Day.landscape = -1;
  edit_Day.summary = "";
  edit_Day.dayCounter = "";

  let weatherIcon = [
    "Snow",
    "Rain",
    "Fog",
    "Wind",
    "Thunder",
    "Cloud",
    "SemiSun",
    "Sun",
  ];
  let nightIcon = ["Star", "Bivouac", "Camp", "Hotel", "Free"];
  let imgNewWeatherActivate = [
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
  ];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starsIcon = ["Ugly", "Soso","Star", "Star", "Star"];
  let imgNewDifficultyActivate = ["_in", "_in", "_in", "_in"];
  let imgNewNightActivate = ["_in", "_in", "_in", "_in", "_in"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in", "_in", "_in"];
  // _in rgb(200,225,200)

  onMount(async (promise) => {
    let res = [];
    res = await fetch("/MDB/roadbook");
    const roa = await res.json();
    roadbook = await roa.roadbook;
  });

  function updateIcons() {
    //mise à jour des icones
    for (var i = 0; i < weatherIcon.length; i++) {
      if (edit_Day.weather === i) {
        imgNewWeatherActivate[i] = "";
      } else {
        imgNewWeatherActivate[i] = "_in";
      }
    }

    for (var i = 0; i < difficultyIcon.length; i++) {
      if (edit_Day.difficulty === 0) {
        // zero day
        imgNewDifficultyActivate[0] = "";
        imgNewDifficultyActivate[i] = "_in";
      } else if (edit_Day.difficulty >= i) {
        imgNewDifficultyActivate[0] = "_in";
        imgNewDifficultyActivate[i] = "";
      } else {
        imgNewDifficultyActivate[i] = "_in";
      }
    }
    for (var i = 0; i < nightIcon.length; i++) {
      if (edit_Day.night === i) {
        imgNewNightActivate[i] = "";
      } else {
        imgNewNightActivate[i] = "_in";
      }
    }

    for (var i = 0; i < starsIcon.length; i++) {
      if (edit_Day.landscape === 0) {
        imgNewLandscapeActivate[0] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if 
      (edit_Day.landscape === 1) {
        imgNewLandscapeActivate[1] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if 
      (edit_Day.landscape === 2) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if 
      (edit_Day.landscape === 3) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[3] = "";
        imgNewLandscapeActivate[i] = "_in";
    } else if 
      (edit_Day.landscape === 4) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[3] = "";        
        imgNewLandscapeActivate[4] = "";
        imgNewLandscapeActivate[0] = "_in";        
        imgNewLandscapeActivate[1] = "_in";
      }   }

    for (var i = 0; i < moodIcon.length; i++) {
      if (edit_Day.mood === i) {
        imgNewMoodActivate[i] = "";
      } else {
        imgNewMoodActivate[i] = "_in";
      }
    }
  }

  function cleanForm() {
    edit_Day.key = "";
    buttonLabel = "Add";
    edit_Day.day = "";
    edit_Day.start = "";
    edit_Day.end = "";
    edit_Day.weather = -1;
    edit_Day.difficulty = -1;
    edit_Day.night = -1;
    edit_Day.landscape = -1;
    edit_Day.summary = "";

    updateIcons();
  }

  export async function editDay(day) {
    let res = await fetch("/MDB/roadbook/day?day=" + day);
    const rday = await res.json();
    edit_Day = await rday.r_day;
    edit_Day.key = edit_Day.day;

    edit_Day.key = edit_Day.day;
    edit_Day.day = [
      edit_Day.day.substring(6, 8),
      edit_Day.day.substring(4, 6),
    ].join("/");

    //mise à jour des icones
    updateIcons();
  }
</script>

<div class="py-2 grid gap-1 md:w-2/3">
  <div class="grid grid-cols-1 w-full md:w-2/3">
    <table id="rdb" class="text-sm text-gray-500 w-full relative">
      <tbody class="">
        {#each roadbook as r}
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 ">
              {r.day.substring(6, 8).concat("/").concat(r.day.substring(4, 6))}
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              <img
                src="/images/{weatherIcon[r.weather]}.png"
                alt=""
                class="w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              {#each difficultyIcon as di, i}
                {#if i === 0}
                  {#if r.difficulty === 0}
                    <img
                      src="/images/{difficultyIcon[i]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{difficultyIcon[i]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {:else if r.difficulty >= i}
                  <img
                    src="/images/{difficultyIcon[i]}.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {:else}
                  <img
                    src="/images/{difficultyIcon[i]}_in.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {/if}
              {/each}
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              <img
                src="/images/{nightIcon[r.night]}.png"
                alt=""
                class="w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              {#each starsIcon as si, i}
              {#if i === 0}
                  {#if r.landscape === 0}
                    <img
                      src="/images/{starsIcon[0]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[0]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
                {#if i === 1}
                  {#if r.landscape === 1}
                    <img
                      src="/images/{starsIcon[1]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[1]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
                {#if i >= 2}                 
                  {#if r.landscape >= i}
                    <img
                      src="/images/{starsIcon[i]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[i]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
             {/each}
            </td>
            <td class="align-middle py-1 px-1 w-[5%]">
              <button
                class="bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                id={r.key}
                on:click={editDay(r.key)}>Détail</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <h1 class="mt-4">détail de la journée</h1>
  <div class="grid grid-cols-1 w-full mt-4">
    <div class=" w-full  flex flex-wrap -mx-3 md:mb-6">
      <div class="w-1/2 md:w-1/4 px-3 mb-3 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Jour: {edit_Day.dayCounter}
        </label>
      </div>
      <div class="w-1/2 md:w-1/4 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Date: {edit_Day.day}
        </label>
      </div>
      <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Départ: {edit_Day.start}
        </label>
      </div>
      <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Arrivée: {edit_Day.end}
        </label>
      </div>
    </div>
    <div class=" w-full  flex flex-wrap -mx-3 md:mb-6">
      <div class="w-full md:w-1/3 px-3 mb-3 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Météo: <img
            src="/images/{weatherIcon[edit_Day.weather]}.png"
            alt=""
            class="w-[30px] inline"
          />
        </label>
      </div>
      <div class="w-full md:w-2/3 px-3 mb-3 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Difficulté: {#each difficultyIcon as di, i}
            {#if i === 0}
              {#if edit_Day.difficulty === 0}
                <img
                  src="/images/{difficultyIcon[i]}.png"
                  alt=""
                  class="w-[30px] inline"
                />
              {:else}
                <img
                  src="/images/{difficultyIcon[i]}_in.png"
                  alt=""
                  class="w-[30px] inline"
                />
              {/if}
            {:else if edit_Day.difficulty >= i}
              <img
                src="/images/{difficultyIcon[i]}.png"
                alt=""
                class="w-[30px] inline"
              />
            {:else}
              <img
                src="/images/{difficultyIcon[i]}_in.png"
                alt=""
                class="w-[30px] inline"
              />
            {/if}
          {/each}
        </label>
      </div>
    </div>
  </div>
  <div class=" w-full  flex flex-wrap -mx-3  mb-0 md:mb-3">
    <div class="w-full md:w-1/3 px-3 mb-3 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Nuit: <img
          src="/images/{nightIcon[edit_Day.night]}.png"
          alt=""
          class="w-[30px] inline"
        />
      </label>
    </div>
    <div class="w-full md:w-2/3 px-3 mb-3 md:mb-0">        
      <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      for="grid-first-name"
    >
        Paysage: {#each starsIcon as si, i}
          <img
            src="/images/{si}{imgNewLandscapeActivate[i]}.png"
            alt=""
            class="w-[30px] inline"
          />
      {/each}
      </label>
    </div>
  </div>
  <div class=" w-full  flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3 mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        {edit_Day.summary}
      </label>
    </div>
  </div>
</div>
