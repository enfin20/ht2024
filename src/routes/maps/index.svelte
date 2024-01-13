<script>
  import { onMount } from "svelte";
  import { Map, MapStyle, Marker, config } from "@maptiler/sdk";
  import "@maptiler/sdk/dist/maptiler-sdk.css";

  let map;
  let mapContainer;

  config.apiKey = "8QNJUsF8HTs1bpZmbcBs";

  onMount(() => {
    const initialState = { lng: 6.65169, lat: 45.17334, zoom: 12 };

    map = new Map({
      container: mapContainer,
      style: MapStyle.OUTDOOR,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    new Marker({ color: "rgb(75, 230, 192)" })
      .setLngLat([6.65169, 45.17334])
      .addTo(map);
    new Marker({ color: "rgb(0, 110, 118)" })
      .setLngLat([6.59993, 45.1234])
      .addTo(map);
  });
</script>

<div class="map-wrap">
  <div class="map" bind:this={mapContainer} />
</div>

<style>
  .map-wrap {
    position: relative;
    width: 100%;
    height: calc(
      100vh - 77px
    ); /* calculate height of the screen minus the heading */
  }

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
