const main = document.getElementById('main-characters');
const forest = document.getElementById('forest-creatures');
const cave = document.getElementById('cave-creatures');
const navButtons = document.getElementById('nav-buttons');
const backBtnContainer = document.getElementById('back-btn-container');

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