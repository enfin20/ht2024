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
  let starsIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in", "_in", "_in"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  let imgNewMoodActivate = ["_in", "_in", "_in"];
  // _in rgb(200,225,200)
  let chartParcours;
  let ctxParcours;
  var chartParcoursData = [];
  let debutParcours = 100000000;
  let finParcours = 0;
  let variante = 1;

  onMount(async (promise) => {
    loadTables();
    ctxParcours = chartParcours.getContext("2d");
    chartParcoursData = new chartjs(ctxParcours, {});
  });

  export async function loadTables() {
    let res = await fetch("/MDB/roadbook?sort=1");
    const roa = await res.json();
    roadbook = await roa.roadbook;

    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].debutParcours <= debutParcours) {
        debutParcours = roadbook[i].debutParcours;
      }
      if (roadbook[i].finParcours >= finParcours) {
        finParcours = roadbook[i].finParcours;
      }
    }
    loadParcours();
  }

  export async function loadParcours() {
    let distance = [];
    let elevation = [];
    let daysFinParcours = [];
    let dist = [];
    let freq = 1;

    freq = Math.round(Math.max((finParcours - debutParcours) / 2000, 1), 0);
    let res = await fetch(
      "/MDB/distance?variante=" +
        variante +
        "&freq=" +
        freq +
        "&debutParcours=" +
        debutParcours +
        "&finParcours=" +
        finParcours
    );
    const dis = await res.json();
    dist = await dis.distance;
    console.info("dist", dist.length);
    for (var i = 0; i < dist.length; i++) {
      distance.push(Math.round(dist[i].cumul / 1000, 0)),
        elevation.push(dist[i].ele);
      for (var j = 0; j < roadbook.length; j++) {
        if (dist[i].pos === roadbook[j].finParcours) {
          daysFinParcours.push(i);
        }
      }
    }
    console.info("daysFinParcours", daysFinParcours);
    const lineMarkerText = {
      id: "lineMarkerText",
      beforeDatasetDraw: (chart, args, plugins) => {
        const {
          ctx,
          chartArea: { top, bottom, height },
          scales: { x },
        } = chart;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(195, 39, 72)";
        ctx.lineWidth = 3;

        ctx.moveTo(x.getPixelForValue(daysFinParcours[0]), top);
        ctx.lineTo(x.getPixelForValue(daysFinParcours[0]), bottom);
        ctx.stroke();

        ctx.moveTo(x.getPixelForValue(daysFinParcours[1]), top);
        ctx.lineTo(x.getPixelForValue(daysFinParcours[1]), bottom);
        ctx.stroke();

        ctx.moveTo(x.getPixelForValue(daysFinParcours[2]), top);
        ctx.lineTo(x.getPixelForValue(daysFinParcours[2]), bottom);
        ctx.stroke();
      },
    };

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
        xaxes: [
          {
            type: "linear" /* <--- this */,
            scalelabel: {
              display: true,
            },
          },
        ],
      },
      plugins: [lineMarkerText],
    });
  }

  export async function editDay(day) {}
</script>

<div class="w-full">
  <div class="w-full grid grid-cols-1 md:grid-cols-6 mt-5 md:mt-10">
    <select
      bind:value={variante}
      on:change={loadParcours}
      class="text-xs appearance-none border-2 border-gray-200 rounded w-1/2 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
    >
      <option value="1"> Variante 1 </option>
      <option value="2"> Variante 2 </option>
    </select>
    <select
      bind:value={debutParcours}
      on:change={loadParcours}
      class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
    >
      {#each roadbook as r}
        <option value={r.debutParcours}>
          Jour {r.dayCounter} : {r.start}
        </option>
      {/each}
    </select>
    <select
      bind:value={finParcours}
      on:change={loadParcours}
      class="text-xs appearance-none border-2 border-gray-200 rounded  w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
    >
      {#each roadbook as r}
        <option value={r.finParcours}>
          Jour {r.dayCounter} : {r.end}
        </option>
      {/each}
    </select>
  </div>
  <div class="w-full grid grid-cols-1 mt-0 md:mt-5">
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
