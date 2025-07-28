
let map = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

document.getElementById('tiffInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const georaster = await parseGeoraster(arrayBuffer);
    const layer = new GeoRasterLayer({ georaster, opacity: 0.7 });
    layer.addTo(map);
    map.fitBounds(layer.getBounds());
});

document.getElementById('vectorInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'geojson') {
            const geojson = JSON.parse(e.target.result);
            L.geoJSON(geojson).addTo(map);
        } else if (ext === 'kml') {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(e.target.result, 'text/xml');
            const geojson = toGeoJSON.kml(kmlDoc);
            L.geoJSON(geojson).addTo(map);
        } else {
            alert("Unsupported file format");
        }
    };
    reader.readAsText(file);
});
