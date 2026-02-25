const main = document.getElementById('main-characters');
const forest = document.getElementById('forest-creatures');
const cave = document.getElementById('cave-creatures');
const navButtons = document.getElementById('nav-buttons');
const backBtnContainer = document.getElementById('back-btn-container');

const authSection = document.getElementById("auth-section");
const userPanel = document.getElementById("user-panel");
const authMessage = document.getElementById("auth-message");
const pointsDisplay = document.getElementById("points");
const quizSection = document.getElementById("quiz-section");
const shopSection = document.getElementById("shop-section");

function showSection(section) {
  main.style.display = 'none';
  forest.style.display = 'none';
  cave.style.display = 'none';
  
  if(section === 'forest') forest.style.display = 'grid';
  if(section === 'cave') cave.style.display = 'grid';
  
  navButtons.style.display = 'none';
  backBtnContainer.style.display = 'block';
}

document.getElementById('forest-btn').addEventListener('click', () => showSection('forest'));
document.getElementById('cave-btn').addEventListener('click', () => showSection('cave'));

document.getElementById('back-btn').addEventListener('click', () => {
  main.style.display = 'grid';
  forest.style.display = 'none';
  cave.style.display = 'none';
  navButtons.style.display = 'block';
  backBtnContainer.style.display = 'none';
});

function clickSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 180;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

document.querySelectorAll('.card').forEach(card => {
  const btn = card.querySelector('button');
  btn.addEventListener('click', () => {
    clickSound();
    card.classList.toggle('active');
    btn.textContent = card.classList.contains('active') ? 'Bezár' : 'Kinyit';
  });
});

let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};

function saveUsers(){
  localStorage.setItem("users", JSON.stringify(users));
}

function register(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if(users[u]){
    authMessage.textContent = "Ez a név már létezik!";
    return;
  }

  users[u] = {
    password: p,
    points: 0,
    purchases: []
  };

  saveUsers();
  authMessage.textContent = "Sikeres regisztráció!";
}

function login(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if(!users[u] || users[u].password !== p){
    authMessage.textContent = "Hibás adatok!";
    return;
  }

  currentUser = u;
  localStorage.setItem("currentUser", u);
  authSection.style.display = "none";
  userPanel.style.display = "block";
  quizSection.style.display = "block";
  shopSection.style.display = "block";

  updateUI();
  currentQuestionIndex = 0;
  showQuestion();
}

function logout(){
  currentUser = null;
  localStorage.removeItem("currentUser");
  location.reload();
}

function updateUI(){
  pointsDisplay.textContent = users[currentUser].points;
  checkGold();
}

function addPoints(){
  users[currentUser].points += 5;
  saveUsers();
  updateUI();
}

const quizContainer = document.getElementById("quiz-container");

let currentQuestionIndex = 0;

const questions = [
  {q:"Ki a milliárdos vállalkozó?", a:"Puffton"},
  {q:"Ki a mutáns nő?", a:"Virginia"},
  {q:"Hány fegyvert tudsz adni Virginiának?", a:"2"},
  {q:"Hogy hívják a sérült társad?", a:"Kelvin"},
  {q:"Hány karja van Virginiának?", a:"3"},
  {q:"Hány állatfajta található a játékban?", a:"12"},
  {q:"Hogy hívják az ősi ércet?", a:"Solafite"},
  {q:"Van térkép?", a:"Igen"},
  {q:"Van story?", a:"Igen"},
  {q:"Ki a fő ellenfél?", a:"Demon"},
  {q:"Hol zajlik?", a:"Sziget"},
  {q:"Milyen műfaj?", a:"Horror"},
  {q:"Mi a játszható karakter neve?", a:"Jack Holt"},
  {q:"Hány fajta armor létezik?", a:"6", a:"7"},
  {q:"Ki készítette?", a:"Endnight"}
];

function showQuestion(){
  if(currentQuestionIndex >= questions.length){
    quizContainer.innerHTML = "<h3>Vége a kvíznek! 🎉</h3>";
    return;
  }

  const question = questions[currentQuestionIndex];

  quizContainer.innerHTML = `
    <p>${currentQuestionIndex+1}. ${question.q}</p>
    <input type="text" id="answerInput">
    <button onclick="submitAnswer()">Válasz</button>
  `;
}

function submitAnswer(){
  const input = document.getElementById("answerInput").value;
  const correct = questions[currentQuestionIndex].a;

  if(input.toLowerCase().includes(correct.toLowerCase())){
    addPoints();
    alert("Helyes! +5 Solafite");
  } else {
    alert("Rossz válasz!");
  }

  currentQuestionIndex++;
  showQuestion();
}

const shopItems = [
  {name:"Arany Kard", price:20},
  {name:"Mutáns Páncél", price:30},
  {name:"Titkos Relikvia", price:40}
];

const shopContainer = document.getElementById("shop-items");

shopItems.forEach((item,i)=>{
  const div = document.createElement("div");
  div.innerHTML = `
    <p>${item.name} - ${item.price} Solafite</p>
    <button onclick="buyItem(${i})">Megveszem</button>
  `;
  shopContainer.appendChild(div);
});

function buyItem(i){
  const item = shopItems[i];
  const user = users[currentUser];

  if(user.purchases.includes(item.name)){
    alert("Már megvetted!");
    return;
  }

  if(user.points < item.price){
    alert("Nincs elég Solafitod!");
    return;
  }

  user.points -= item.price;
  user.purchases.push(item.name);
  saveUsers();
  updateUI();
  alert("Sikeres vásárlás!");
}

function checkGold(){
  if(currentUser){
    document.body.classList.add("gold-theme");
  } else {
    document.body.classList.remove("gold-theme");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem("currentUser");
  if(savedUser && users[savedUser]){
    currentUser = savedUser;
    authSection.style.display = "none";
    userPanel.style.display = "block";
    quizSection.style.display = "block";
    shopSection.style.display = "block";
    updateUI();
    currentQuestionIndex = 0;
    showQuestion();
  }
});