// src/main.ts
import exampleIconUrl from "./dazuo.png";
import "./style.css";

let counter = 0; // 当前 qi 总量
let growthRate = 0; // 每秒自动增长速率，初始为 0

const UNIT = "qi";
const CLICK_GAIN = 1;

// Step 6：升级配置 + 已购买次数
type Upgrade = {
  id: string;
  label: string;
  cost: number;
  bonus: number;
};

const upgrades: Upgrade[] = [
  { id: "upgradeA", label: "Upgrade A (+0.1/sec)", cost: 10, bonus: 0.1 },
  { id: "upgradeB", label: "Upgrade B (+2/sec)", cost: 100, bonus: 2.0 },
  { id: "upgradeC", label: "Upgrade C (+50/sec)", cost: 1000, bonus: 50.0 },
];

// 已购买次数
const purchased: Record<string, number> = {
  upgradeA: 0,
  upgradeB: 0,
  upgradeC: 0,
};

document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="meditator" />
    <div id="counter">0 ${UNIT}</div>
    <div id="rate" class="rate">0.00 ${UNIT}/sec</div>
  </div>

  <div id="shop">
    ${
  upgrades
    .map(
      (u) => `
      <div class="shop-row">
        <button id="${u.id}" disabled>
          ${u.label} — Cost: ${u.cost} ${UNIT}
        </button>
        <span id="${u.id}-count" class="count-badge">x0</span>
      </div>
    `,
    )
    .join("")
}
  </div>
`;

// DOM 引用
const meditate = document.getElementById("meditate") as HTMLDivElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement;
const rateDiv = document.getElementById("rate") as HTMLDivElement;

// 点击小人：立刻 +1 qi
meditate.addEventListener("click", () => {
  counter += CLICK_GAIN;
  refreshUI();
});

// 绑定三个升级按钮
upgrades.forEach((u) => {
  const btn = document.getElementById(u.id) as HTMLButtonElement;
  btn.addEventListener("click", () => {
    if (counter >= u.cost) {
      counter -= u.cost;
      growthRate += u.bonus;
      purchased[u.id] += 1;
      refreshUI();
    }
  });
});

// 刷新界面：总量 / 速率 / 每种已购次数 / 按钮是否可用
function refreshUI(): void {
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;
  rateDiv.textContent = `${growthRate.toFixed(2)} ${UNIT}/sec`;

  upgrades.forEach((u) => {
    const btn = document.getElementById(u.id) as HTMLButtonElement;
    const badge = document.getElementById(
      `${u.id}-count`,
    ) as HTMLSpanElement;

    btn.disabled = counter < u.cost;
    badge.textContent = `x${purchased[u.id]}`;
  });
}

// requestAnimationFrame 循环：按真实时间自动增长
let last = performance.now();

function loop(now: number): void {
  const dt = (now - last) / 1000; // 秒
  last = now;

  counter += dt * growthRate;
  refreshUI();

  requestAnimationFrame(loop);
}

// 初始化一次 UI，然后启动循环
refreshUI();
requestAnimationFrame(loop);
