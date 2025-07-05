
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const cardDisplay = document.getElementById('card-result');
const cardOwner = document.getElementById('card-owner');
const turnIndicator = document.getElementById('turn-indicator');
const playerScore = document.getElementById('player-score');
const iaScore = document.getElementById('ia-score');
let currentPlayer = 'Joueur';
let angle = 0;
let isSpinning = false;
let playerPts = 0;
let iaPts = 0;
// Segments de la roue
const segments = [
  { label: 'Attaque', value: '+20', color: '#ff6363', icon: '⚔️' },
  { label: 'Défense', value: '+10', color: '#3a86ff', icon: '🛡️' },
  { label: 'Bonus', value: '+30', color: '#06d6a0', icon: '✨' },
  { label: 'Malus', value: '-15', color: '#8338ec', icon: '☠️' },
  { label: 'Points', value: '+50', color: '#ffd166', icon: '⭐' },
  { label: 'Attaque', value: '+20', color: '#ef476f', icon: '⚔️' },
  { label: 'Défense', value: '+10', color: '#118ab2', icon: '🛡️' },
  { label: 'Points', value: '+40', color: '#f4a261', icon: '⭐' }
];
const segmentAngle = 2 * Math.PI / segments.length;
// Dessiner la roue
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  segments.forEach((seg, i) => {
    const start = i * segmentAngle + angle;
    const end = start + segmentAngle;
    // Dessin du segment
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, start, end);
    ctx.fillStyle = seg.color;
    ctx.fill();
    // Texte et icône
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(start + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`${seg.icon} ${seg.label}`, 180, 10);
    ctx.restore();
  });
}
// Faire tourner la roue
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const randomSpin = Math.random() * 360 + 720;
  const finalAngle = angle + (randomSpin * Math.PI / 180);
  const spinDuration = 4000;
  const start = performance.now();
  function animate(now) {
    const progress = (now - start) / spinDuration;
    if (progress < 1) {
      angle = finalAngle * easeOutCubic(progress);
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      angle = finalAngle % (2 * Math.PI);
      drawWheel();
      showResult();
      isSpinning = false;
    }
  }
  requestAnimationFrame(animate);
}
// Easing animation
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
// Affichage du résultat
function showResult() {
  const index = Math.floor((segments.length - (angle / (2 * Math.PI)) * segments.length) % segments.length);
  const segment = segments[index];
  cardOwner.textContent = `Carte pour : ${currentPlayer}`;
  cardDisplay.textContent = `${segment.icon} ${segment.label} (${segment.value})`;
  cardDisplay.classList.add('show');
  const value = parseInt(segment.value);
  if (!isNaN(value)) {
    if (currentPlayer === 'Joueur') {
      playerPts += value;
      playerScore.textContent = `Joueur: ${playerPts}`;
    } else {
      iaPts += value;
      iaScore.textContent = `IA: ${iaPts}`;
    }
    
  }
  setTimeout(() => {
    currentPlayer = currentPlayer === 'Joueur' ? 'IA' : 'Joueur';
    turnIndicator.textContent = `Tour de ${currentPlayer}`;
  }, 1000);
}

function checkVictory() {
  if (playerPts >= 1000) {
    showVictory("Vous");
  } else if (iaPts >= 1000) {
    showVictory("L'IA");
  }
}
function showVictory(winnerName) {
  const messageBox = document.getElementById("victoryMessage");
  const winnerText = document.getElementById("winnerText");
  winnerText.textContent = `${winnerName} a gagné !`;
  messageBox.classList.remove("hidden");
  setTimeout(() => {
    resetGame(); // Redémarrer après 5 secondes
    messageBox.classList.add("hidden");
  }, 5000);
}
function resetGame() {
  playerScore = 0;
  iaScore = 0;
  updateScoreDisplay();
  // Réinitialiser la partie : cartes, tour, etc.
}

// Initialisation
drawWheel();
checkVictory();
spinBtn.addEventListener('click', spinWheel);