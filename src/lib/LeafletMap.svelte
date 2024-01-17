<script>
  import { onMount, onDestroy } from "svelte";

  let mapElement;
  let map;

  onMount(async () => {
    if (typeof window != "undefined") {
      const leaflet = await import("leaflet");
      var greenIcon = new leaflet.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      var redIcon = new leaflet.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      map = leaflet.map(mapElement).setView([45.17334, 6.65169], 12);
      leaflet
        .tileLayer("https://a.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);

      leaflet
        .marker([45.17334, 6.65169], {
          title: "départ jour 1",
          icon: greenIcon,
        })
        .addTo(map)
        .bindPopup("Départ jour 1")
        .openPopup();
      leaflet
        .marker([45.1234, 6.59993], { icon: redIcon })
        .addTo(map)
        .bindPopup("Arrivée jour 1")
        .openPopup();
    }
  });

  onDestroy(async () => {
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }
  });
</script>

<main>
  <div bind:this={mapElement} id="map" />
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  #map {
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
