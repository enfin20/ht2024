<script>
  import { onMount } from "svelte";  
  import Geolocation from "svelte-geolocation";

  let getPositionAgain = false;
  let detail = {};

  let roadbook = [];
  var buttonLabel = "Add";
  var edit_Day = Object();
  edit_Day.key = "";
  edit_Day.day = "";
  edit_Day.start = "";
  edit_Day.end = "";
  edit_Day.weather = -1;
  edit_Day.difficulty = -1;
  edit_Day.night = -1;
  edit_Day.landscape = -1;
  edit_Day.mood = -1;
  edit_Day.detail = "";
  edit_Day.summary = "";
  edit_Day.dayCounter = 0;
  edit_Day.lat = "";
  edit_Day.lng = "";
  edit_Day.debutParcours = 0;
  edit_Day.finParcours = 0;
  edit_Day.dist = 0;
  edit_Day.elePos = 0;
  edit_Day.eleNeg = 0;

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

  onMount(async (promise) => {
    let res = [];
    res = await fetch("/MDB/roadbook");
    const roa = await res.json();
    roadbook = await roa.roadbook;
    let lastDay = 0;
    let dayId = 0;
    for (var i = 0; i < roadbook.length; i++) {
      if(lastDay < roadbook[i].dayCounter){
        lastDay = roadbook[i].dayCounter;
        dayId = i;
      }
    }
    edit_Day.start = roadbook[dayId].end
    edit_Day.debutParcours = roadbook[dayId].finParcours
    edit_Day.dayCounter = roadbook[dayId].dayCounter + 1;
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

  export async function calcDist(){
    let res = await fetch("/MDB/parcours?debutParcours=" + edit_Day.debutParcours + "&finParcours=" + edit_Day.finParcours);
    const par = await res.json();
    let parcours = await par.parcours;
    edit_Day.dist = 0;
    edit_Day.elePos = 0;
    edit_Day.eleNeg = 0;
    console.info("edit_Day", edit_Day);
    for (var i = 0; i < parcours.length; i++){
      edit_Day.dist += (parcours[i].dist/1000);
      edit_Day.elePos += parcours[i].elepos;
      edit_Day.eleNeg += parcours[i].eleneg;
    }
    edit_Day.dist = Math.round((edit_Day.dist + Number.EPSILON) * 10) / 10

    console.info("edit_Day", edit_Day);
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
    edit_Day.mood = -1;
    edit_Day.detail = "";
    edit_Day.summary = "";
    edit_Day.lat = "";
    edit_Day.lng = "";
    edit_Day.dist = 0;
    edit_Day.elePos = 0;
    edit_Day.eleNeg = 0;

    let lastDay = 0;
    let dayId = 0;
    for (var i = 0; i < roadbook.length; i++) {
      if(lastDay < roadbook[i].dayCounter){
        lastDay = roadbook[i].dayCounter;
        dayId = i;
      }
    } 
    edit_Day.start = roadbook[dayId].end
    edit_Day.debutParcours = roadbook[dayId].finParcours
    edit_Day.dayCounter = roadbook[dayId].dayCounter + 1;
    buttonLabel = "Add";
    updateIcons();
  }

  export async function editDay(day) {
    let res = await fetch("/MDB/roadbook/day?day=" + day);
    const rday = await res.json();
    edit_Day = await rday.r_day;
    edit_Day.key = edit_Day.day;

    edit_Day.key = edit_Day.day;
    edit_Day.day = [
      edit_Day.day.substring(0, 4),
      edit_Day.day.substring(4, 6),
      edit_Day.day.substring(6, 8),
    ].join("-");
    buttonLabel = "Update";
    calcDist();
    //mise à jour des icones
    updateIcons();
  }

  export async function insertRoadbook() {
    let new_id = "";
    var res = new Object();
    edit_Day.day = edit_Day.day
      .substring(0, 4)
      .concat(edit_Day.day.substring(5, 7))
      .concat(edit_Day.day.substring(8, 10));
    edit_Day.weather = Number(edit_Day.weather);
    edit_Day.difficulty = Number(edit_Day.difficulty);
    edit_Day.night = Number(edit_Day.night);
    edit_Day.landscape = Number(edit_Day.landscape);
    edit_Day.mood = Number(edit_Day.mood);
    edit_Day.dayCounter = Number(edit_Day.dayCounter);
    edit_Day.lat = Number(edit_Day.lat);
    edit_Day.lng = Number(edit_Day.lng);

    // find gps closest point
    res = await fetch("/MDB/parcours");
    const par = await res.json();
    let parcours = await par.parcours;
    let minDist=99999;
    let dist = 99999;
    let parcours_pos = ""
    for (var i=0; i < parcours.length; i++){
      dist=Math.abs((Number(parcours[i].lng) - Number(edit_Day.lng))**2 + ((Number(parcours[i].lat) - Number(edit_Day.lat))**2));
      if (dist < minDist ){
        minDist = dist;
        parcours_pos = parcours[i].pos;
      }
      if (dist === 0 ){
        i = parcours.length;
      }
    }
    edit_Day.finParcours = parcours_pos;
    calcDist();

    if (edit_Day.key === "") {
      // Insert new day

      res = await fetch("/MDB/roadbook", {
        method: "POST",
        body: JSON.stringify(edit_Day),
      });
      new_id = await res.json();
      edit_Day.key = edit_Day.day;

      // remise à jour du tableau
      roadbook.unshift({
        day: edit_Day.day,
        start: edit_Day.start,
        end: edit_Day.end,
        key: edit_Day.day,
        weather: edit_Day.weather,
        difficulty: edit_Day.difficulty,
        night: edit_Day.night,
        landscape: edit_Day.landscape,
        mood: edit_Day.mood,
        detail: edit_Day.detail,
        summary: edit_Day.summary,
        dayCounter: edit_Day.dayCounter,
      });
      roadbook = roadbook;
    } else {
      // update day

      res = await fetch("/MDB/roadbook", {
        method: "PUT",
        body: JSON.stringify(edit_Day),
      });

      //mise à jour du tableau
      for (var i = 0; i < roadbook.length; i++) {
        if (roadbook[i].day === edit_Day.day) {
          roadbook[i].weather = Number(edit_Day.weather);
          roadbook[i].difficulty = Number(edit_Day.difficulty);
          roadbook[i].night = Number(edit_Day.night);
          roadbook[i].landscape = Number(edit_Day.landscape);
          roadbook[i].mood = Number(edit_Day.mood);
          roadbook[i].detail = edit_Day.detail;
          roadbook[i].summary = edit_Day.summary;
          roadbook[i].start = edit_Day.start;
          roadbook[i].end = edit_Day.end;
          roadbook[i].dayCounter = Number(edit_Day.dayCounter);
          roadbook[i].dist = Number(edit_Day.dist);
          roadbook[i].elePos = Number(edit_Day.elePos);
          roadbook[i].eleNeg = Number(edit_Day.eleNeg); 
          roadbook[i].finParcours = Number(edit_Day.finParcours);
          roadbook[i].debutParcours = Number(edit_Day.debutParcours);      }
      }
    }
    cleanForm();
  }/**/
</script>

<Geolocation
  getPosition="{getPositionAgain}"
  watch="{!getPositionAgain}"
  on:position="{(e) => {
    detail = e.detail;
    edit_Day.lat = detail.coords.latitude;
    edit_Day.lng = detail.coords.longitude;   
    console.info("detail", detail.coords );
  }}"
/>
<div class="py-2 grid gap-1">
  <div class="grid grid-cols-1 place-content-center w-full">
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Lat
        </label>
        <input
          type="text"
          bind:value={edit_Day.lat}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          lng
        </label>
        <input
          type="text"
          bind:value={edit_Day.lng}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          on:click={updateIcons}
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        &nbsp;
      </label>
        <button on:click="{() => (getPositionAgain = !getPositionAgain)}" class=" text-white border bg-teal-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-teal-700">
          Go
        </button>
      </div>
    </div>
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          distance
        </label>
        <input
          type="text"
          bind:value={edit_Day.dist}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Positif
        </label>
        <input
          type="text"
          bind:value={edit_Day.elePos}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Negatif</label>
        <input
          type="text"
          bind:value={edit_Day.eleNeg}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>
    <form class="w-full " on:submit|preventDefault={insertRoadbook}>
      <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
        <div class="w-1/4 md:w-1/4 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Jour
          </label>
          <input
            type="text"
            bind:value={edit_Day.dayCounter}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
        <div class="w-3/4 md:w-1/4 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Date
          </label>
          <input
            type="date"
            bind:value={edit_Day.day}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            on:click={updateIcons}
          />
        </div>
        <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Début
          </label>
          <input
            type="text"
            bind:value={edit_Day.start}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
        <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Fin
          </label>
          <input
            type="text"
            bind:value={edit_Day.end}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
      </div>
      <div class=" w-full md:w-1/2 flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Météo
          </label>
          {#each weatherIcon as wi, i}
            <input
              type="radio"
              bind:group={edit_Day.weather}
              name="r_weather"
              value={i}
              id="r_weather{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_weather{i}"
              class="select-none cursor-pointer  py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out  "
            >
              <img
                src="/images/{wi}{imgNewWeatherActivate[i]}.png"
                alt=""
                class="w-[30px] inline"
              /></label
            >
          {/each}
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Difficulté
          </label>
          {#each difficultyIcon as di, i}
            <input
              type="radio"
              bind:group={edit_Day.difficulty}
              name="r_difficulty"
              value={i}
              id="r_difficulty{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_difficulty{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{di}{imgNewDifficultyActivate[i]}.png"
                alt=""
                class="w-[40px] inline"
              /></label
            >
          {/each}
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Nuit
          </label>
          {#each nightIcon as ni, i}
            <input
              type="radio"
              bind:group={edit_Day.night}
              name="r_night"
              value={i}
              id="r_night{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_night{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{ni}{imgNewNightActivate[i]}.png"
                alt=""
                class="w-[40px] inline"
              /></label
            >
          {/each}
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Paysage
          </label>
          {#each starsIcon as si, i}
            <input
              type="radio"
              bind:group={edit_Day.landscape}
              name="r_landscape"
              value={i}
              id="r_landscape{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_landscape{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{si}{imgNewLandscapeActivate[i]}.png"
                alt=""
                class="w-[40px] inline"
              /></label
            >
          {/each}
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Humeur
          </label>
          {#each moodIcon as mi, i}
            <input
              type="radio"
              bind:group={edit_Day.mood}
              name="mood"
              value={i}
              id="r_mood{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_mood{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{mi}{imgNewMoodActivate[i]}.png"
                alt=""
                class="w-[40px] inline"
              /></label
            >
          {/each}
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Résumé
          </label>
          <textarea
            bind:value={edit_Day.summary}
            class=" w-full appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
            rows="5"
          />
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Détails
          </label>
          <textarea
            bind:value={edit_Day.detail}
            class=" w-full appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
            rows="20"
          />
        </div>
        <div class="w-1/2 px-3 mb-6 md:mb-0">
          <button
            class="bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click={cleanForm}
          >
            Clear
          </button>
        </div>
        <div class="w-1/2 px-3 mb-6 md:mb-0">
          <button
            class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </form>
  </div>
  <div class="w-full md:w-1/2 flex flex-wrap">
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
