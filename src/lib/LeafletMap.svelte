<script>
  import { onMount, onDestroy } from "svelte";
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
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starsIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let mapElement;
  let map;
  let roadbook = [];

  onMount(async () => {
    loadTables();
  });

  onDestroy(async () => {
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }
  });

  export async function loadTables() {
    let res = await fetch("/MDB/roadbook?sort=1");
    let diffIcons = "";
    const roa = await res.json();

    roadbook = await roa.roadbook;
    console.info("roadbook", roadbook.length);
    if (typeof window != "undefined") {
      const leaflet = await import("leaflet");

      var starIcon = new leaflet.Icon({
        iconUrl: "/images/starred.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var campIcon = new leaflet.Icon({
        iconUrl: "/images/camping-tent.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var hotelIcon = new leaflet.Icon({
        iconUrl: "/images/home.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var reposIcon = new leaflet.Icon({
        iconUrl: "/images/bed.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var typeIcons = [starIcon, campIcon, hotelIcon, reposIcon];
      let iconIndex = 0;

      map = leaflet
        .map(mapElement)
        .setView(
          [
            Number(roadbook[0].debutParcoursLat) +
              (Number(roadbook[roadbook.length - 1].finParcoursLat) -
                Number(roadbook[0].debutParcoursLat)) /
                2,
            Number(roadbook[0].debutParcoursLng) +
              (Number(roadbook[roadbook.length - 1].finParcoursLng) -
                Number(roadbook[0].debutParcoursLng)) /
                2,
          ],
          14
        );
      leaflet
        .tileLayer("https://a.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);
      var markers = [];

      markers.push(
        leaflet.marker(
          [
            Number(roadbook[0].debutParcoursLat),
            Number(roadbook[0].debutParcoursLng),
          ],
          {
            title: "départ jour " + roadbook[0].dayCounter,
            icon: typeIcons[iconIndex],
          }
        )
      );
      for (var i = 0; i < roadbook.length; i++) {
        if (
          Number(roadbook[i].finParcoursLat) +
            Number(roadbook[i].finParcoursLng) >
          0
        ) {
          if (roadbook[i].night === 1 || roadbook[i].night === 2) {
            iconIndex = 1;
          } else {
            iconIndex = 2;
          }
          diffIcons = "";
          for (var j = 0; j < difficultyIcon.length; j++) {
            if (j === 0) {
              if (roadbook[i].difficulty === 0) {
                diffIcons =
                  "<img src='/images/" +
                  difficultyIcon[0] +
                  ".png' class='w-[15px] md:w-[30px] inline' />";
              } else {
                diffIcons =
                  "<img src='/images/" +
                  difficultyIcon[0] +
                  "_in.png' class='w-[15px] md:w-[30px] inline' />";
              }
            } else {
              if (roadbook[i].difficulty >= j) {
                diffIcons +=
                  "<img src='/images/" +
                  difficultyIcon[j] +
                  ".png' class='w-[15px] md:w-[30px] inline' />";
              } else {
                diffIcons +=
                  "<img src='/images/" +
                  difficultyIcon[j] +
                  "_in.png' class='w-[15px] md:w-[30px] inline' />";
              }
            }
          }

          markers.push(
            leaflet
              .marker(
                [
                  Number(roadbook[i].finParcoursLat),
                  Number(roadbook[i].finParcoursLng),
                ],
                {
                  title: "Arrivée jour " + roadbook[i].dayCounter,
                  icon: typeIcons[iconIndex],
                }
              )
              .bindPopup(
                "<h1>Jour " +
                  roadbook[i].dayCounter +
                  ": " +
                  roadbook[i].start +
                  " / " +
                  roadbook[i].end +
                  "</h1><div class='text-sm'><img src='/images/" +
                  weatherIcon[roadbook[i].weather] +
                  ".png' class='w-[25px] md:w-[30px] inline' />" +
                  roadbook[i].dist +
                  " kms " +
                  roadbook[i].elePos +
                  " / " +
                  roadbook[i].eleNeg +
                  " m </div><br/>" +
                  diffIcons +
                  "<div>" +
                  roadbook[i].summary +
                  "</div>"
              )
          );
        } else {
          markers.push(
            leaflet
              .marker(
                [
                  Number(roadbook[i - 1].finParcoursLat),
                  Number(roadbook[i - 1].finParcoursLng),
                ],
                {
                  title: "Arrivée jour " + roadbook[i].dayCounter,
                  icon: typeIcons[3],
                }
              )
              .bindPopup(
                "<h1>Jour " +
                  roadbook[i].dayCounter +
                  ": " +
                  roadbook[i].start +
                  "</h1>Repos<div>" +
                  roadbook[i].summary +
                  "</div>"
              )
          );
        }
      }

      var shelterMarkers = leaflet.featureGroup();
      shelterMarkers.addTo(map);
      for (var i = 0; i < markers.length; i++) {
        var currentShelter = markers[i];
        currentShelter.addTo(shelterMarkers);
      }
      map.fitBounds(shelterMarkers.getBounds());
    }
  }
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
