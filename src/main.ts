// src/main.ts
import exampleIconUrl from "./dazuo.png";
import "./style.css";

let counter = 0; // 当前灵气总量
let growthRate = 0; // 每秒自动增长速率

// Step 8: 统一叙事 —— 修仙 / 灵气主题
const UNIT = "qi"; // 显示为 “x.xx qi”
const CLICK_GAIN = 1;

// 升级配置：香炉 / 打坐蒲团 / 上古灵像
type Upgrade = {
  id: string; // 按钮 id
  label: string; // 显示文字（不含价格）
  cost: number; // 初始价格（保留）
  currentCost: number; // 当前价格（会增长）
  bonus: number; // 增长速率加成 (UNIT/sec)
};

const upgrades: Upgrade[] = [
  {
    id: "upgradeA",
    label: "Incense Burner (+0.1 qi/sec)",
    cost: 10,
    currentCost: 10,
    bonus: 0.1,
  },
  {
    id: "upgradeB",
    label: "Meditation Mat (+2 qi/sec)",
    cost: 100,
    currentCost: 100,
    bonus: 2.0,
  },
  {
    id: "upgradeC",
    label: "Ancient Spirit Statue (+50 qi/sec)",
    cost: 1000,
    currentCost: 1000,
    bonus: 50.0,
  },
];

// 已购次数
const purchased: Record<string, number> = {
  upgradeA: 0,
  upgradeB: 0,
  upgradeC: 0,
};

// ---------- HTML ----------
document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="cultivator in meditation" />
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
          ${u.label} — Cost: <span id="${u.id}-price">${
        u.currentCost.toFixed(
          2,
        )
      }</span> ${UNIT}
        </button>
        <span id="${u.id}-count" class="count-badge">x0</span>
      </div>
    `,
    )
    .join("")
}
  </div>
`;

// ---------- DOM ----------
const meditate = document.getElementById("meditate") as HTMLDivElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement;
const rateDiv = document.getElementById("rate") as HTMLDivElement;

// 点击打坐：立刻 +1 qi
meditate.addEventListener("click", () => {
  counter += CLICK_GAIN;
  refreshUI();
});

// 升级按钮逻辑（香炉 / 蒲团 / 灵像）
upgrades.forEach((u) => {
  const btn = document.getElementById(u.id) as HTMLButtonElement;

  btn.addEventListener("click", () => {
    if (counter >= u.currentCost) {
      counter -= u.currentCost;
      growthRate += u.bonus;
      purchased[u.id] += 1;

      // Step 7：价格上涨 15%
      u.currentCost *= 1.15;

      refreshUI();
    }
  });
});

// ---------- UI ----------
function refreshUI(): void {
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;
  rateDiv.textContent = `${growthRate.toFixed(2)} ${UNIT}/sec`;

  upgrades.forEach((u) => {
    const btn = document.getElementById(u.id) as HTMLButtonElement;
    const badge = document.getElementById(
      `${u.id}-count`,
    ) as HTMLSpanElement;
    const price = document.getElementById(
      `${u.id}-price`,
    ) as HTMLSpanElement;

    btn.disabled = counter < u.currentCost;
    badge.textContent = `x${purchased[u.id]}`;
    price.textContent = u.currentCost.toFixed(2);
  });
}

// ---------- requestAnimationFrame ----------
let last = performance.now();

function loop(now: number): void {
  const dt = (now - last) / 1000; // 秒
  last = now;

  counter += dt * growthRate;
  refreshUI();

  requestAnimationFrame(loop);
}

// 启动
refreshUI();
requestAnimationFrame(loop);
