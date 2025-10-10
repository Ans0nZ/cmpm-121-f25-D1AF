import exampleIconUrl from "./dazuo.png";
import flameIconUrl from "./lingqi.png";
import "./style.css";

let counter: number = 0;
const UNIT = "qi";
const rps = 1;

document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="meditator" />
    <img src="${flameIconUrl}" id="flame" class="flame" alt="flame" />
    <div id="counter" class="counter">0 ${UNIT}</div>
  </div>
  
  
`;
const meditate = document.getElementById("meditate")!;
const flame = document.getElementById("flame") as HTMLImageElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement; //counter div

meditate.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} ${UNIT}`;

  flame.classList.add("show");
  setTimeout(() => flame.classList.remove("show"), 600);
});

let last = performance.now();
function loop(now: number) {
  const dt = (now - last) / 1000;
  last = now;

  counter += dt * rps;
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
