const imageWidth = 1920;
const imageHeight = 1080;

const bounds = [[0, 0], [imageHeight, imageWidth]];

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1,
  maxZoom: 3,
  zoomSnap: 0.25,
  maxBoundsViscosity: 1.0
});

L.imageOverlay('sotfmap.jpg', bounds).addTo(map);
map.fitBounds(bounds);
map.setZoom(map.getZoom() + 0.5);
map.setMaxBounds(bounds);
map.on('drag', () => {
  map.panInsideBounds(bounds, { animate: false });
});

const caveIcon = L.icon({
  iconUrl: 'iconscave.webp',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const bunkerIcon = L.icon({
  iconUrl: 'M.webp',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const VIPIcon = L.icon({
  iconUrl: 'agy.webp',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const gpsLocatorIcon = L.icon({
  iconUrl: 'felkialtojel.webp',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const caveLayer = L.layerGroup().addTo(map);
const bunkerLayer = L.layerGroup().addTo(map);
const VIPLayer = L.layerGroup().addTo(map);
const gpsLocatorLayer = L.layerGroup().addTo(map);

const caves = [
  {
    name: "Partmenti Barlang",
    coords: [935, 800],
    desc: "Sokkoló, búvárfelszerelés, artifact darab",
    img: "partibarlang.webp"
  },
  {
    name: "Mászó Barlang",
    coords: [690, 1250],
    desc: "Csákány, artifact",
    img: "maszobarlang.jpg"
  },
  {
    name: "Földszinti bejárat",
    coords: [850, 1360],
    desc: "Artifact darab",
    img: "Földszinti bejárat.jpg"
  },
  {
    name: "Pokol barlang",
    coords: [650, 1370],
    desc: "Endgame elkezdése",
    img: "pokolbarlang.webp"
  },
  {
    name: "Tavas-barlang",
    coords: [430, 1160],
    desc: "Ősi páncél és 2 artifact darab",
    img: "urhajo.webp"
  },
  {
    name: "Zipline barlang",
    coords: [500, 600],
    desc: "Zipline, kereszt, artifact darab",
    img: "zipline.webp"
  },
  {
    name: "Ásó barlang",
    coords: [565, 750],
    desc: "Ásó, esőkabát, zseblámpa",
    img: "lapatbarlang.webp"
  }
];

const bunkers = [
  {
    name: "Maintenance Bunker A",
    coords: [730, 770],
    desc: "Tűzoltó Balta, 3D nyomtató",
    img: "Maintenance_bunker_A.jpg"
  },

  {
    name: "Maintenance Bunker B",
    coords: [230, 570],
    desc: "íj, 3D nyomtató",
    img: "Maintenance_bunker_B.jpg"
  },

  {
    name: "Maintenance Bunker C",
    coords: [830, 1250],
    desc: "keycard, 3D nyomtató",
    img: "Maintenance_bunker_C.jpg"
  },
];

const VIP = [
  {
    name: "Barlang – Lakó Bunker",
    coords: [400, 1230],
    desc: "Katana helye",
    img: "katana.webp"
  }
];

const gpsLocator = [
  {
    name: "Shotgun Helye",
    coords: [855, 570],
    desc: "Shotgun helye",
    img: "shotgun.webp"
  },
    {
    name: "Zseblámpa Helye",
    coords: [565, 700],
    desc: "Zseblámpa helye",
    img: "flashlight.webp"
  },
  {
    name: "Hajó a tengeren",
    coords: [1000, 800],
    desc: "Pisztoly helye",
    img: "gun.webp"
  }
];

caves.forEach(cave => {
  L.marker(cave.coords, { icon: caveIcon })
    .addTo(caveLayer)
    .on('click', () => showInfo(cave));
});

bunkers.forEach(bunker => {
  L.marker(bunker.coords, { icon: bunkerIcon })
    .addTo(bunkerLayer)
    .on('click', () => showInfo(bunker));
});

VIP.forEach(VIP => {
  L.marker(VIP.coords, { icon: VIPIcon })
    .addTo(VIPLayer)
    .on('click', () => showInfo(VIP));
});

gpsLocator.forEach(gpsLocator => {
  L.marker(gpsLocator.coords, { icon: gpsLocatorIcon })
    .addTo(gpsLocatorLayer)
    .on('click', () => showInfo(gpsLocator));
});

function showInfo(item) {
  document.getElementById('info').innerHTML = `
    <h2>${item.name}</h2>
    <p>${item.desc}</p>
    ${item.img ? `<img src="${item.img}" alt="${item.name}" style="max-width:100%; margin-top:10px;">` : ''}
  `;
}

function toggleCaves() {
  if (map.hasLayer(caveLayer)) {
    map.removeLayer(caveLayer);
  } else {
    map.addLayer(caveLayer);
  }
}

function toggleBunkers() {
  if (map.hasLayer(bunkerLayer)) {
    map.removeLayer(bunkerLayer);
  } else {
    map.addLayer(bunkerLayer);
  }
}

function toggleVIP() {
  if (map.hasLayer(VIPLayer)) {
    map.removeLayer(VIPLayer);
  } else {
    map.addLayer(VIPLayer);
  }
}

function toggleGPSLocator() {
  if (map.hasLayer(gpsLocatorLayer)) {
    map.removeLayer(gpsLocatorLayer);
  } else {
    map.addLayer(gpsLocatorLayer);
  }
}

function checkGold(){
  const user = users[currentUser];
  if(user.purchases.length === shopItems.length){
    document.body.classList.add("gold-theme");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem("currentUser");
  if(savedUser){
    document.body.classList.add("gold-theme");
  }
});

function login(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if(!users[u] || users[u].password !== p){
    authMessage.textContent = "Hibás adatok!";
    return;
  }

  currentUser = u;
  authSection.style.display = "none";
  userPanel.style.display = "block";
  quizSection.style.display = "block";
  shopSection.style.display = "block";

  updateUI();
  currentQuestionIndex = 0;
  showQuestion();
}