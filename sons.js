const main = document.getElementById('main-characters');
const forest = document.getElementById('forest-creatures');
const cave = document.getElementById('cave-creatures');
const navButtons = document.getElementById('nav-buttons');
const backBtnContainer = document.getElementById('back-btn-container');

const authSection = document.getElementById("auth-section");
const userPanel = document.getElementById("user-panel");
const pointsDisplay = document.getElementById("points");
const quizSection = document.getElementById("quiz-section");
const shopSection = document.getElementById("shop-section");
const quizContainer = document.getElementById("quiz-container");
const shopContainer = document.getElementById("shop-items");

const API_URL = "http://localhost:3000/users";
let currentUser = null;
let currentQuestionIndex = 0;

// --- SEGÉDFÜGGVÉNYEK ---

function showNotification(message, type='info'){
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;

    const container = document.getElementById('quiz-notification-container');
    (container && container.offsetParent !== null ? container : document.body).appendChild(notification);

    setTimeout(()=>notification.classList.add('show'), 10);
    
    // Megnövelve 2 másodpercre, hogy biztosan látszódjon
    setTimeout(()=>{
        notification.classList.remove('show');
        setTimeout(()=>notification.remove(), 300);
    }, 2000);
}

function updateUI(){
    if(currentUser && pointsDisplay) pointsDisplay.textContent = currentUser.points;
    checkGold();
}

// --- AUTENTIKÁCIÓ (JAVÍTVA) ---

async function register(event){
    if(event) event.preventDefault(); // STOP: Ne frissüljön az oldal!

    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    if(!u || !p){ showNotification("Add meg a nevet és jelszót","error"); return; }

    try {
        const res = await fetch(`${API_URL}?username=${u}`);
        const data = await res.json();
        if(data.length > 0){ showNotification("Ez a név már létezik!","error"); return; }

        const newUser = { username:u, password:p, points:0, purchases:[], quizIndex:0 };
        const createRes = await fetch(API_URL,{
            method:'POST',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(newUser)
        });
        
        const createdUser = await createRes.json();
        showNotification("Sikeres regisztráció! Üdv a szigeten!", "success");

        // VÁRAKOZÁS: 1.5 mp-ig hagyjuk látni az üzenetet, csak utána lépünk be
        setTimeout(() => {
            currentUser = createdUser;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            authSection.style.display='none';
            userPanel.style.display='block';
            quizSection.style.display='block';
            shopSection.style.display='block';
            updateUI();
            currentQuestionIndex = 0;
            showQuestion();
            renderShop();
        }, 1500);

    } catch(err){
        showNotification("Szerver hiba a regisztrációnál!","error");
    }
}

async function login(event){
    if(event) event.preventDefault(); // STOP: Ne frissüljön az oldal!

    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    if(!u || !p){ showNotification("Add meg a nevet és jelszót","error"); return; }

    try {
        const res = await fetch(`${API_URL}?username=${u}`);
        const data = await res.json();
        if(data.length===0 || data[0].password!==p){
            showNotification("Hibás felhasználónév vagy jelszó!","error");
            return;
        }

        showNotification("Sikeres bejelentkezés!", "success");

        // VÁRAKOZÁS a belépés előtt
        setTimeout(() => {
            currentUser = data[0];
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            authSection.style.display='none';
            userPanel.style.display='block';
            quizSection.style.display='block';
            shopSection.style.display='block';
            updateUI();
            currentQuestionIndex = currentUser.quizIndex || 0;
            showQuestion();
            renderShop();
        }, 1200);

    } catch(err){
        showNotification("Szerver hiba a belépésnél!","error");
    }
}

// --- KVÍZ ÉS PONTOZÁS (JAVÍTVA) ---

async function submitAnswer() {
    const inputField = document.getElementById("answerInput");
    if (!inputField) return;

    const input = inputField.value.trim();
    if (!input) {
        showNotification("Írj be valamit!", "error");
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = input.toLowerCase().includes(currentQuestion.a.toLowerCase());

    if (isCorrect) {
        showNotification("Helyes! +5 Solafite", "success");
        await addPoints(5);
        inputField.style.backgroundColor = "#b1f5b5"; // brighter green
        inputField.style.color = "#0b3a01";
        inputField.style.borderColor = "#55b159";
    } else {
        showNotification(`Rossz válasz!`, "error");
        inputField.style.backgroundColor = "#f8a1a7"; // brighter red
        inputField.style.color = "#5f070d";
        inputField.style.borderColor = "#e03a44";
    }

    setTimeout(() => {
        inputField.style.backgroundColor = "";
        inputField.style.color = "";
        inputField.style.borderColor = "";
    }, 2000);

    currentQuestionIndex++;

    if (currentUser) {
        currentUser.quizIndex = currentQuestionIndex;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        try {
            await fetch(`${API_URL}/${currentUser.id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quizIndex: currentQuestionIndex })
            });
        } catch (err) {
            console.error("Szerver hiba mentéskor:", err);
        }
    }

    setTimeout(() => {
        showQuestion();
    }, 2000);
}

async function addPoints(amount){
    if(!currentUser) return;
    currentUser.points += amount;
    updateUI();
    try {
        await fetch(`${API_URL}/${currentUser.id}`,{
            method:'PATCH',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({points:currentUser.points})
        });
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } catch(e) {
        console.error("Nem sikerült a pontokat menteni");
    }
}

// --- TÖBBI FUNKCIÓ (KÁRTYÁK, BOLT STB.) ---

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
    {q:"Hány fajta armor létezik?", a:"7"},
    {q:"Ki készítette?", a:"Endnight"}
];

function showQuestion() {
    if (!quizContainer) return;

    // Ha elfogytak a kérdések
    if (currentQuestionIndex >= questions.length) {
        quizContainer.innerHTML = `
            <div class="quiz-end">
                <h3>Minden kérdésre válaszoltál!</h3>
                <p>Gratulálunk, gyűjtöttél egy kis Solafite-ot.</p>
                <button onclick="resetQuiz()">Újra az elejéről</button>
            </div>`;
        return;
    }

    const question = questions[currentQuestionIndex];
    // Itt kiürítjük az előző kérdést és berakjuk az újat
    quizContainer.innerHTML = `
        <div class="quiz-card">
            <h3>${currentQuestionIndex + 1}. Kérdés</h3>
            <p>${question.q}</p>
            <input type="text" id="answerInput" placeholder="Írd ide a választ..." autocomplete="off">
            <button onclick="submitAnswer()">Válasz beküldése</button>
        </div>
    `;
    
    // Autofókusz az inputra, hogy ne kelljen kattintani
    document.getElementById("answerInput").focus();
}

function resetQuiz(){
    currentQuestionIndex = 0;
    if(currentUser) currentUser.quizIndex = 0;
    showQuestion();
}

const shopItems=[
    {name:"Arany Kard", price:20, Image:"Solar_katana.webp"},
    {name:"Mutáns Páncél", price:30, Image:"CreepyArmorFullFarket.webp"},
    {name:"Artifact", price:40, Image:"Artifact_Piece_G_Icon.webp"},
    {name:"Sokkoló", price:25, Image:"Stzuntgun.webp"},
    {name:"Búvárfelszerelés", price:15, Image:"scubagear.webp"},
    {name:"Ősi Páncél", price:35, Image:"Golden_Armor.webp"}
];

function renderShop() {
    if(!shopContainer) return;
    shopContainer.innerHTML = '';
    shopItems.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "shop-card";
        const hasBought = currentUser && currentUser.purchases.includes(item.name);
        div.innerHTML = `
            <p>${item.name}</p>
            <img src="${item.Image}" alt="${item.name}" style="width:80px;">
            <p>${item.price} Solafite</p>
            <button onclick="buyItem(${i})" ${hasBought ? 'disabled' : ''}>
                ${hasBought ? 'Megvéve' : 'Megveszem'}
            </button>
        `;
        shopContainer.appendChild(div);
    });
}

async function buyItem(i){
    if(!currentUser) return;
    const item = shopItems[i];

    if(currentUser.purchases.includes(item.name)) return;

    if(currentUser.points < item.price){
        showNotification("Nincs elég Solafitod! Keress többet a kvízzel!","error");
        return;
    }

    currentUser.points -= item.price;
    currentUser.purchases.push(item.name);
    
    updateUI();
    showNotification(`Sikeresen megvetted: ${item.name}`, "success");

    await fetch(`${API_URL}/${currentUser.id}`,{
        method:'PATCH',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({points:currentUser.points, purchases:currentUser.purchases})
    });
    
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    renderShop();
}

function checkGold(){
    if(currentUser && currentUser.purchases.length === shopItems.length){
        document.body.classList.add("gold-theme");
    }
}

function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    location.reload(); // Kijelentkezésnél tiszta lapot indítunk
}

// --- INDÍTÁS ---
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem("currentUser");
    if(savedUser){
        currentUser = JSON.parse(savedUser);
        authSection.style.display='none';
        userPanel.style.display='block';
        quizSection.style.display='block';
        shopSection.style.display='block';
        updateUI();
        currentQuestionIndex = currentUser.quizIndex || 0;
        showQuestion();
        renderShop();
    }
});