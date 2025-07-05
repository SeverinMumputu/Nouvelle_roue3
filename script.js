HTLM
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Roue avec effets sonores</title>
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle at center, #1e1e3f, #0f0f1f);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
    }
    canvas { display: block; }
    button {
      margin-top: 20px;
      padding: 12px 28px;
      font-size: 18px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
    button:hover { background: #d32f2f; }
  </style>
</head>
<body>
<canvas id="wheel" width="600" height="400"></canvas>
<button onclick="spin()">🔄 Tourner la roue</button>
<!-- 🎵 Sons -->
<audio id="clickSound" src="click.mp3" preload="auto"></audio>
<audio id="spinSound" src="spinning-wheel.mp3" preload="auto"></audio>
<script>
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height * 1.3;
const radius = 360;
const segments = 24;
const anglePerSegment = (2 * Math.PI) / segments;
const labels = Array.from({ length: segments }, (_, i) => `Option ${i + 1}`);
const colors = ["#f44336", "#4caf50", "#ff9800", "#2196f3", "#e91e63", "#9c27b0", "#3f51b5", "#009688"];
const borderThickness = 10;
const ledSize = 6;
const ledCount = segments;
const ledRadius = radius + borderThickness / 2 + ledSize;
const ledColors = ["#e74c3c", "#f1c40f"];
let ledBlinkState = false, ledBlinkTimer = 0, rotation = 0, spinning = false;
const ledBlinkDelay = 30;
let arrowTilt = 0, arrowDecay = 0.15, lastImpactTime = 0;
// 🔊 Lecture son de clic
function playClick() {
  const s = document.getElementById('clickSound');
  if (s) { s.currentTime = 0; s.play(); }
}
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < segments; i++) {
    const start = rotation + i * anglePerSegment;
    const end = start + anglePerSegment;
    // Segment principal
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    // Croûte intérieure
    const crustOuterRadius = radius - 2;
    const crustInnerRadius = radius - 30;
    ctx.beginPath();
    ctx.arc(centerX, centerY, crustOuterRadius, start, end);
    ctx.arc(centerX, centerY, crustInnerRadius, end, start, true);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Boutons de croûte
    const buttonRadius = radius - 16;
    const buttonSize = 5;
    const leftX = centerX + Math.cos(start) * buttonRadius;
    const leftY = centerY + Math.sin(start) * buttonRadius;
    const rightX = centerX + Math.cos(end) * buttonRadius;
    const rightY = centerY + Math.sin(end) * buttonRadius;
    ctx.beginPath(); ctx.arc(leftX, leftY, buttonSize, 0, 2 * Math.PI); ctx.fillStyle = "#ccc"; ctx.fill();
    ctx.strokeStyle = "#555"; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(rightX, rightY, buttonSize, 0, 2 * Math.PI); ctx.fillStyle = "#ccc"; ctx.fill();
    ctx.stroke();
    // Collision
    const fx = centerX;
    const fy = centerY - radius - borderThickness / 2 + 20;
    const dL = Math.hypot(fx - leftX, fy - leftY);
    const dR = Math.hypot(fx - rightX, fy - rightY);
    if ((dL < 8 || dR < 8) && spinning && Date.now() - lastImpactTime > 100) {
      lastImpactTime = Date.now();
      arrowTilt = 0.35; // collision = inclinaison
      playClick();      // effet sonore
    }
    const mid = (start + end) / 2;
    const textX = centerX + Math.cos(mid) * (radius - 50);
    const textY = centerY + Math.sin(mid) * (radius - 50);
    if (Math.sin(mid) < -0.1) continue;
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  }
  // Bordure extérieure
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + borderThickness / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.lineWidth = borderThickness;
  ctx.stroke();
  // LEDs clignotantes
  const currentColor = ledBlinkState ? ledColors[0] : ledColors[1];
  for (let i = 0; i < ledCount; i++) {
    const angle = i * anglePerSegment + anglePerSegment / 2;
    const x = centerX + Math.cos(angle) * ledRadius;
    const y = centerY + Math.sin(angle) * ledRadius;
    ctx.beginPath(); ctx.shadowColor = currentColor; ctx.shadowBlur = 10;
    ctx.fillStyle = currentColor; ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5;
    ctx.arc(x, y, ledSize, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  }
  // 🔺 Flèche avec inclinaison diagonale
  const arrowBaseY = centerY - radius - borderThickness / 2;
  const offsetX = arrowTilt * 10;
  ctx.beginPath();
  ctx.moveTo(centerX - 10 + offsetX, arrowBaseY);
  ctx.quadraticCurveTo(centerX - 6 + offsetX, arrowBaseY + 6, centerX - 3 + offsetX, arrowBaseY + 20);
  ctx.lineTo(centerX + 3 + offsetX, arrowBaseY + 20);
  ctx.quadraticCurveTo(centerX + 6 + offsetX, arrowBaseY + 6, centerX + 10 + offsetX, arrowBaseY);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 5;
  ctx.fill();
  ctx.shadowBlur = 0;
  // Clou central
  ctx.beginPath();
  ctx.arc(centerX, arrowBaseY, 7, 0, 2 * Math.PI);
  ctx.fillStyle = "#f44336";
  ctx.strokeStyle = "#880000";
  ctx.lineWidth = 1.5;
  ctx.fill(); ctx.stroke();
  // Masque bas
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, canvas.height - 130);
  ctx.quadraticCurveTo(centerX, canvas.height - 30, canvas.width, canvas.height - 130);
  ctx.lineTo(canvas.width, canvas.height); ctx.closePath();
  ctx.fillStyle = "#0f0f1f"; ctx.fill();
}
function spin() {
  if (spinning) return;
  spinning = true;
  let speed = 0.15 + Math.random() * 0.2;
  const decel = 0.985;
  const minSpeed = 0.002;
  const spinAudio = document.getElementById("spinSound");
  if (spinAudio) { spinAudio.currentTime = 0; spinAudio.play(); }
  function animate() {
    if (speed > minSpeed) {
      rotation += speed;
      speed *= decel;
      updateLedBlink();
      // inclinaison réaliste (inertie)
      if (arrowTilt !== 0) {
        arrowTilt *= (1 - arrowDecay);
        if (Math.abs(arrowTilt) < 0.001) arrowTilt = 0;
      }
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      ledBlinkState = false;
      if (spinAudio) { spinAudio.pause(); spinAudio.currentTime = 0; }
      drawWheel();
    }
  }
  animate();
}
function updateLedBlink() {
  ledBlinkTimer++;
  if (ledBlinkTimer > ledBlinkDelay) {
    ledBlinkTimer = 0;
    ledBlinkState = !ledBlinkState;
  }
}
drawWheel();
</script>
</body>
</html>