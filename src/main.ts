// src/main.ts
import exampleIconUrl from "./dazuo.png";
import "./style.css";

// Current total qi
let counter = 0;

// Passive growth rate (qi per second)
let growthRate = 0;

const UNIT = "qi";
const CLICK_GAIN = 1;

// Step 10: Data-driven design + description field
interface Item {
  name: string; // Display name (button title)
  description: string; // Short description (tooltip / subtitle)
  cost: number; // Base price
  rate: number; // Qi gained per second
}

// Five cultivation-themed items (first three keep original assignment values)
const availableItems: Item[] = [
  {
    name: "Incense Burner",
    description: "A simple burner that gently gathers qi around you.",
    cost: 10,
    rate: 0.1,
  },
  {
    name: "Meditation Mat",
    description: "A comfy mat that lets you meditate longer without numb legs.",
    cost: 100,
    rate: 2.0,
  },
  {
    name: "Ancient Spirit Statue",
    description: "An ancient statue that radiates dense spiritual energy.",
    cost: 1000,
    rate: 50.0,
  },
  {
    name: "Spirit Tea House",
    description: "Brews spirit tea that keeps your focus sharp and qi flowing.",
    cost: 5000,
    rate: 150.0,
  },
  {
    name: "Floating Cloud Pavilion",
    description: "A sanctuary above the clouds where qi condenses rapidly.",
    cost: 20000,
    rate: 600.0,
  },
];

// Number of items purchased (one-to-one with availableItems)
const purchasedCounts: number[] = availableItems.map(() => 0);

// Compute current price = base cost * 1.15^(purchase count)
function getCurrentCost(index: number): number {
  const base = availableItems[index].cost;
  const count = purchasedCounts[index];
  return base * Math.pow(1.15, count);
}

// ---------- HTML UI ----------
document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="cultivator in meditation" />
    <div id="counter">0 ${UNIT}</div>
    <div id="rate" class="rate">0.00 ${UNIT}/sec</div>
  </div>

  <div id="shop">
    ${
      availableItems
        .map(
          (item, index) => `
        <div class="shop-row">
          <button id="buy-${index}" disabled>
            <div class="item-title">
              ${item.name} (+${item.rate} ${UNIT}/sec)
            </div>
            <div class="item-desc">
              ${item.description}
            </div>
            <div class="item-cost">
              Cost: <span id="price-${index}">${getCurrentCost(index).toFixed(2)}</span> ${UNIT}
            </div>
          </button>
          <span id="count-${index}" class="count-badge">x0</span>
        </div>
      `
        )
        .join("")
    }
  </div>
`;

// ---------- DOM References ----------
const meditate = document.getElementById("meditate") as HTMLDivElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement;
const rateDiv = document.getElementById("rate") as HTMLDivElement;

// Manual click: +1 qi per click
meditate.addEventListener("click", () => {
  counter += CLICK_GAIN;
  refreshUI();
});

// Bind each upgrade button
availableItems.forEach((item, index) => {
  const btn = document.getElementById(`buy-${index}`) as HTMLButtonElement;

  // Use description as tooltip text
  btn.title = item.description;

  btn.addEventListener("click", () => {
    const currentCost = getCurrentCost(index);
    if (counter >= currentCost) {
      // Deduct cost
      counter -= currentCost;
      // Increase growth rate
      growthRate += item.rate;
      // Track purchases
      purchasedCounts[index] += 1;
      // Refresh UI (price, counts, button states)
      refreshUI();
    }
  });
});

// ---------- UI Refresh ----------
function refreshUI(): void {
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;
  rateDiv.textContent = `${growthRate.toFixed(2)} ${UNIT}/sec`;

  availableItems.forEach((item, index) => {
    const btn = document.getElementById(`buy-${index}`) as HTMLButtonElement;
    const priceSpan = document.getElementById(`price-${index}`) as HTMLSpanElement;
    const countSpan = document.getElementById(`count-${index}`) as HTMLSpanElement;

    const currentCost = getCurrentCost(index);

    // Update price and owned count
    priceSpan.textContent = currentCost.toFixed(2);
    countSpan.textContent = `x${purchasedCounts[index]}`;

    // Enable / disable button based on affordability
    btn.disabled = counter < currentCost;

    // Refresh tooltip text (not strictly needed, but keeps description in sync)
    btn.title = item.description;
  });
}

// ---------- Passive Growth Loop (requestAnimationFrame) ----------
let last = performance.now();

function loop(now: number): void {
  const dt = (now - last) / 1000; // seconds elapsed
  last = now;

  // Apply automated growth
  counter += dt * growthRate;
  refreshUI();

  requestAnimationFrame(loop);
}

// Start game loop
refreshUI();
requestAnimationFrame(loop);
