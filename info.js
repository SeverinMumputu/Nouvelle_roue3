
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');

const colors = ['#FFC107', '#4CAF50', '#2196F3', '#E91E63'];
const resultText = document.getElementById('current-card');
const segmentTypes = ['Attaque', 'Défense', 'Joker', 'Bonus', 'Malus', 'Points'];
const typeColors = {
  'Attaque': '#e74c3c',
  'Défense': '#2980b9',
  'Joker': '#9b59b6',
  'Bonus': '#2ecc71',
  'Malus': '#f39c12',
  'Points': '#1abc9c'
};
let segments = Array.from({ length: totalSegments }, (_, i) => {
  const type = segmentTypes[i % segmentTypes.length];
  return {
    name: `${type} ${i + 1}`,
    type: type,
    color: typeColors[type]
  };
});
// Dessiner la roue
function drawWheel(rotation = 0) {
  ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2); // Nettoyage complet
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate((rotation * Math.PI) / 180);
 for (let i = 0; i < totalSegments; i++) {
  const startAngle = i * segmentAngle * Math.PI / 180;
  const endAngle = (i + 1) * segmentAngle * Math.PI / 180;
  const segment = segments[i];
  // Dessin du segment
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillStyle = segment.color;
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.lineTo(0, 0);
  ctx.fill();
  // Texte dans le segment
  ctx.save();
  ctx.rotate(startAngle + (endAngle - startAngle) / 2);
  ctx.translate(radius * 0.65, 0);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText(segment.type, -ctx.measureText(segment.type).width / 2, 0);
  ctx.restore();
}
}
let currentRotation = 0;
drawWheel(currentRotation);
// Son (clics de la roue)
const tickSound = new Howl({
  src: ['https://freesound.org/data/previews/341/341695_6261194-lq.mp3'],
  volume: 0.3,
  sprite: {
  tick: [0, 300]
  }
});
// Animer la roue
document.getElementById('spin-btn').addEventListener('click', () => {
  let spins = 5 + Math.random() * 5;
  let finalAngle = 360 * spins;
  const oldRotation = currentRotation;
  gsap.to({ angle: 0 }, {
    angle: finalAngle,
    duration: 5,
    ease: 'power3.out',
    onUpdate: function () {
      currentRotation = oldRotation + this.targets()[0].angle;
      drawWheel(currentRotation % 360);
      if (Math.floor(currentRotation) % segmentAngle < 1) {
        tickSound.play('tick');
      }
    },
    onComplete: function () {
  const finalDeg = (currentRotation % 360 + 360) % 360;
  const selectedIndex = Math.floor((360 - finalDeg) / segmentAngle) % totalSegments;
  const result = segments[selectedIndex];
  resultText.textContent = `${result.type} - ${result.name}`;
}
  });
});


const canvas = document.getElementById("wheel"); 
const ctx = canvas.getContext("2d"); 
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");
const radius = canvas.width / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let angle = 0; let isSpinning = false;
const segments = 
[ { label: "Malus surprise 😈", count: 10 }, 
  { label: "Délivrance 😇", count: 10 }, 
  { label: "x3 Temps ⏱️", count: 5 }, 
  { label: "/2 Temps ⏱️", count: 5 }, 
  { label: "25s 🕒", count: 10 },
   { label: "50s 🕔", count: 10 }, 
   { label: "75s 🕖", count: 10 }, 
   { label: "100s 🕘", count: 12 }, 
   { label: "200s 🕛", count: 4 }, 
   { label: "Rien ❌", count: 20 }, 
   { label: "Joker 🎭", count: 12 },
   { label: "Cadeau 🎁", count: 12 },
   { label: "Rejouer 🔄", count: 12 },
   { label: "+1 Carte 🃏", count: 6 }, 
   { label: "+2 Cartes 🃏🃏", count: 6 }, 
   { label: "Mystère ❓", count: 10 },
   { label: "-15s ⏳", count: 12 },
   { label: "-50s ⏳", count: 6 },
   { label: "-1 Carte 📉", count: 12 }, 
   { label: "Perte Joker ❌🎭", count: 12 },
   { label: "-1 Slot 💼", count: 6 }, 
   { label: "-30% Temps ⏱️", count: 6 },
   { label: "-50% Gain ⏱️", count: 12 } ];
let wheelSegments = []; segments.forEach(seg => { for (let i = 0; i < seg.count; i++) { wheelSegments.push(seg.label); } });
function drawWheel() { 
  const total = wheelSegments.length; const arc = (2 * Math.PI) / total;
wheelSegments.forEach((segment, i) => { 
  const angleStart = i * arc; 
  ctx.beginPath(); 
  ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff6666"; 
  ctx.moveTo(centerX, centerY); 
  ctx.arc(centerX, centerY, radius, angleStart, angleStart + arc); 
  ctx.fill();
  ctx.save();
  ctx.translate(centerX, centerY); 
  ctx.rotate(angleStart + arc / 2);
  ctx.textAlign = "right"; 
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.fillText(segment, radius - 10, 0);
  ctx.restore(); 
 }); }
drawWheel();
function spinWheel() { 
  if (isSpinning) return;
   isSpinning = true;
const spinTime = Math.random() * 3000 + 2000;
const finalAngle = Math.random() * 2 * Math.PI;
const total = wheelSegments.length;
const arc = (2 * Math.PI) / total;
let start = null;
function animate(timestamp) { 
  if (!start) start = timestamp;
   const progress = timestamp - start;
    const rotate = easeOut(progress, 0, finalAngle + 10 * 2 * Math.PI, spinTime);
     ctx.clearRect(0, 0, canvas.width, canvas.height); 
     ctx.save(); 
     ctx.translate(centerX, centerY);
      ctx.rotate(rotate); 
      ctx.translate(-centerX, -centerY);
       drawWheel();
        ctx.restore();
if (progress < spinTime) {
  requestAnimationFrame(animate);
} else {
  const index = Math.floor((total - ((rotate % (2 * Math.PI)) / arc)) % total);
  result.textContent = `Résultat : ${wheelSegments[index]}`;
  isSpinning = false;
}
}
requestAnimationFrame(animate); }

function easeOut(t, b, c, d) {
   t /= d; t--; 
   return c * (t * t * t + 1) + b;
   }
spinButton.addEventListener("click", spinWheel);

.wheel-wrapper {
   flex: 1 1 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#wheel {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle at center, #ffcc00, #ff9900);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
}

#game-container { 
   display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  }

  .zone-centrale {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

#spin-btn {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #00adb5;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}
#spin-btn:hover {
  background-color: #06d6a0;
}
