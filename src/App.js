import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWR5YXNlbnJhZmUiLCJhIjoiY2x2Y2JkZW5oMGd0bDJpbXVidHA3c3MxZSJ9.Y1_I4S7zrgT4d62NclsImg"; // Your Mapbox access token

const App = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [area, setArea] = useState("");

  useEffect(() => {
    if (!map && mapContainerRef.current) {
      const mapboxMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-70.9, 42.35],
        zoom: 9,
      });

      const mapboxDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });

      mapboxMap.addControl(mapboxDraw);
      setMap(mapboxMap);
      setDraw(mapboxDraw);

      mapboxMap.on("draw.create", updateArea);
      mapboxMap.on("draw.delete", updateArea);
      mapboxMap.on("draw.update", updateArea);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, mapContainerRef]); // Included mapContainerRef in the dependency array

  const updateArea = (e) => {
    if (draw) {
      // Ensure draw is not null
      const data = draw.getAll();
      if (data.features.length > 0) {
        const calculatedArea = turf.area(data);
        const roundedArea = Math.round(calculatedArea * 100) / 100;
        setArea(`${roundedArea} square meters`);
      } else {
        setArea("");
        if (e.type !== "draw.delete") {
          alert("Click the map to draw a polygon.");
        }
      }
    }
  };

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ></div>
      <div
        className="calculation-box"
        style={{
          height: "75px",
          width: "150px",
          position: "absolute",
          bottom: "40px",
          left: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <p>Click the map to draw a polygon.</p>
        <div>{area}</div>
      </div>
    </div>
  );
};

export default App;
