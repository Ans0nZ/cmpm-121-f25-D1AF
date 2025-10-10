import exampleIconUrl from "./dazuo.png";
import flameIconUrl from "./lingqi.png";
import "./style.css";

let counter: number = 0;
const UNIT = "qi";
//const rps = 1;
let growthRate = 0;
const UPGRADE_COST = 10;

document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="meditator" />
    <img src="${flameIconUrl}" id="flame" class="flame" alt="flame" />
    <div id="counter" class="counter">0 ${UNIT}</div>

    <button id="buy-upgrade" disabled>
      Upgrade — Cost: 10 ${UNIT}
    </button>
  </div>
  
  
`;
const meditate = document.getElementById("meditate")!;
const flame = document.getElementById("flame") as HTMLImageElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement; //counter div

// Upgrade button(step 5)
const buyButton = document.getElementById("buy-upgrade") as HTMLButtonElement;

meditate.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} ${UNIT}`;

  flame.classList.add("show");
  setTimeout(() => flame.classList.remove("show"), 600);
});

function refreshUI() {
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;
  buyButton.disabled = counter < UPGRADE_COST;
}

buyButton.addEventListener("click", () => {
  if (counter >= UPGRADE_COST) {
    counter -= UPGRADE_COST;
    growthRate += 1;
    refreshUI();
  }
});

let last = performance.now();
function loop(now: number) {
  const dt = (now - last) / 1000;
  last = now;

  counter += dt * growthRate;
  refreshUI();
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
