<script>
  import { onMount } from "svelte";  
  import chartjs from "chart.js/auto";

  let roadbook = [];

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
  let nightIcon = ["Star", "Bivouac", "Camp", "Hotel", "Free"];
  let imgNewNightActivate = ["_in", "_in", "_in", "_in", "_in"];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let imgNewDifficultyActivate = ["_in", "_in", "_in", "_in"];
  let starsIcon = ["Ugly", "Soso","Star", "Star", "Star"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in", "_in", "_in"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  let imgNewMoodActivate = ["_in", "_in", "_in"];
  // _in rgb(200,225,200)
  let chartParcours;
  let ctxParcours;
  var chartParcoursData = [];

  onMount(async (promise) => {
    loadTables();
    ctxParcours = chartParcours.getContext("2d");
    chartParcoursData = new chartjs(ctxParcours, {});
  });

    export async function loadTables()  {
    let distance =[];
    let elevation =[];
    let res = [];
    let par =[];
    let parc =[];
    let distCumul = 0;

    res = await fetch("/MDB/roadbook?sort=1");
    const roa = await res.json();
    roadbook = await roa.roadbook;
    for (var i = 0; i < roadbook.length; i++){
      if (roadbook[i].debutParcours > 0 && roadbook[i].finParcours > 0){
        let res = await fetch("/MDB/parcours?debutParcours=" + roadbook[i].debutParcours + "&finParcours=" + roadbook[i].finParcours);
        let par = await res.json();
        let parc = await par.parcours;
        for (var j = 0; j < parc.length; j++){
          distCumul += parc[j].dist;
          if (j % 100 === 0 ) {
          distance.push(Math.round((distCumul/1000 + Number.EPSILON)));
          elevation.push(parc[j].ele);}
        }
      }
    }
    chartParcoursData.destroy();
    chartParcoursData = new chartjs(ctxParcours, {
      type: "line",
      data: {
        labels: distance,
        datasets: [
          {
            label: "Parcours",
            data: elevation,
          },
        ],
       },       
       options: {
          borderWidth: 2,
            cubicInterpolationMode: "monotone",
            pointStyle: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          },


    });
  };
  export async function editDay(day) {
  }

</script>
<div class="w-full">
  <div class="w-full grid grid-cols-1 mt-5 md:mt-10">
    <canvas bind:this={chartParcours} />
  </div>
  <div class="w-full grid grid-cols-1 mt-5 md:mt-10">
    <table id="rdb" class="w-full text-xs text-gray-500 bg-white">
      <tbody class="">
        {#each roadbook as r}
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 ">
              {r.day.substring(6, 8).concat("/").concat(r.day.substring(4, 6))}
            </td>
            <td class="text-left align-middle py-1 px-px ">
              <img
                src="/images/{moodIcon[r.mood]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
              <img
                src="/images/{weatherIcon[r.weather]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
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
            <td class="text-left align-middle py-1  px-px ">
              <img
                src="/images/{nightIcon[r.night]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
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
            <td class="text-left align-middle py-1 px-px ">
              {r.dist || 0}
            </td>
            <td class="text-left align-middle py-1 px-2 ">
              {r.elePos || 0}
            </td>
            <td class="text-left align-middle py-1 px-2 ">
              {r.eleNeg || 0}
            </td>
            <td class="align-middle py-1 px-1 ">
              <button
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                id={r.key}
                on:click={editDay(r.key)}>Edit</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>