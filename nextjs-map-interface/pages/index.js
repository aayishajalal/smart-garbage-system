import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function Home() {
  const [Map, setMap] = useState();
  const [pageIsMounted, setPageIsMounted] = useState(false);

  const stores = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2707, 13.0827], // Anna Nagar coordinates
        },
        properties: {
          id: 1,
          fill_level: "35%",
          address: "Anna Nagar",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Anna Arch",
          postalCode: "600040",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2586, 13.2001], // Manali coordinates
        },
        properties: {
          id: 2,
          fill_level: "50%",
          address: "Manali",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Manali New Town",
          postalCode: "600068",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2536, 13.1134], // Perambur coordinates
        },
        properties: {
          id: 3,
          fill_level: "25%",
          address: "Perambur",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Perambur Railway Station",
          postalCode: "600011",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2217, 13.0504], // Tambaram coordinates
        },
        properties: {
          id: 4,
          fill_level: "75%",
          address: "Tambaram",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Tambaram Railway Station",
          postalCode: "600045",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.1923, 13.0471], // Pallavaram coordinates
        },
        properties: {
          id: 5,
          fill_level: "95%",
          address: "Pallavaram",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Pallavaram Railway Station",
          postalCode: "600043",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2264, 13.0836], // Chromepet coordinates
        },
        properties: {
          id: 6,
          fill_level: "50%",
          address: "Chromepet",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Chromepet Bus Stand",
          postalCode: "600044",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.217, 13.0642], // Guindy coordinates
        },
        properties: {
          id: 7,
          fill_level: "75%",
          address: "Guindy",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Guindy National Park",
          postalCode: "600032",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2257, 13.0112], // Velachery coordinates
        },
        properties: {
          id: 8,
          fill_level: "95%",
          address: "Velachery",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Phoenix MarketCity",
          postalCode: "600042",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.2708, 13.0478], // Adambakkam coordinates
        },
        properties: {
          id: 9,
          fill_level: "50%",
          address: "Adambakkam",
          city: "Chennai",
          country: "India",
          crossStreet: "Near St. Thomas Mount Railway Station",
          postalCode: "600088",
          state: "Tamil Nadu",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [80.0597, 13.1278],
        },
        properties: {
          id: 10,
          fill_level: "99%",
          address: "Pattabiram",
          city: "Chennai",
          country: "India",
          crossStreet: "Near Pattabiram Railway Station",
          postalCode: "600072",
          state: "Tamil Nadu",
        },
      },
    ],
  };

  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWF5aXNoYW5vb3JhIiwiYSI6ImNsdG9rZmtldjBmbnkyaXJxcTBmc3p3bDcifQ.ysCteCLg_AmddGTiOhIAaA";

  useEffect(() => {
    setPageIsMounted(true);
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [80.2707, 13.0827], // Chennai coordinates
      zoom: 11, // Adjust the zoom level as needed
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    setMap(map);
  }, []);

  useEffect(() => {
    if (pageIsMounted && stores) {
      Map.on("load", () => {
        Map.addSource("places", {
          type: "geojson",
          data: stores,
        });
        buildLocationList(stores);
        addMarkers();
      });
    }
  });

  function addMarkers() {
    for (const feature of stores.features) {
      const el = document.createElement("div");
      el.id = `marker-${feature.properties.id}`; // Corrected interpolation syntax
      el.className = "marker";

      let markerURL = "";
      el.style.backgroundSize = "contain";
      el.style.width = "20px"; // Adjust the width as needed
      el.style.height = "25px";
      if (feature.properties.fill_level < "51%") {
        markerURL =
          "https://ik.imagekit.io/690kne5m6/Dustbin/green.png?updatedAt=1710261892393";
      } else if (feature.properties.fill_level < "94np%") {
        markerURL =
          "https://ik.imagekit.io/690kne5m6/Dustbin/orange.png?updatedAt=1710261892385";
      } else {
        markerURL =
          "https://ik.imagekit.io/690kne5m6/Dustbin/red.png?updatedAt=1710261892478";
      }

      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${feature.properties.address}</h3><p>Fill Level: ${feature.properties.fill_level}%</p>`
          )
        )
        .addTo(Map);

      el.style.backgroundImage = `url(${markerURL})`;

      el.addEventListener("click", (e) => {
        flyToStore(feature);
        createPopUp(feature);
        const activeItem = document.getElementsByClassName("active");
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        const listing = document.getElementById(
          `listing-${feature.properties.id}`
        );
        listing.classList.add("active");
      });
    }
  }

  function buildLocationList(stores) {
    for (const store of stores.features) {
      const listings = document.getElementById("listings");
      const listing = listings.appendChild(document.createElement("div"));
      listing.id = `listing-${store.properties.id}`;
      listing.className = "item";

      const link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = `link-${store.properties.id}`;
      link.innerHTML = store.properties.address;

      const details = listing.appendChild(document.createElement("div"));
      details.innerHTML = store.properties.city;
      if (store.properties.phone) {
        details.innerHTML += ` &middot; ${store.properties.phoneFormatted}`;
      }

      link.addEventListener("click", function () {
        for (const feature of stores.features) {
          if (this.id === `link-${feature.properties.id}`) {
            flyToStore(feature);
            createPopUp(feature);
          }
        }
        const activeItem = document.getElementsByClassName("active");
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        this.parentNode.classList.add("active");
      });
    }
  }

  function flyToStore(currentFeature) {
    Map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });
  }

  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h3>Dust Bin</h3><h4>${currentFeature.properties.address}</h4><h4>${currentFeature.properties.fill_level}</h4>`
      )
      .addTo(Map);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Planners Smart Dustbin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.main}>
        <div className="sidebar">
          <div className="heading">
            <h1>Our locations</h1>
          </div>
          <div id="listings" className="listings"></div>
        </div>
        <div id="map" className="map"></div>
      </main>
      <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js"></script>
    </div>
  );
}
