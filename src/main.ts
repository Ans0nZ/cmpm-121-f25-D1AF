// src/main.ts
import exampleIconUrl from "./dazuo.png";
import "./style.css";

// 当前灵气总量
let counter = 0;
// 每秒自动增长速率
let growthRate = 0;

const UNIT = "qi";
const CLICK_GAIN = 1;

// Step 9: 数据驱动设计 —— 用一个数组描述所有物品
interface Item {
  name: string; // 名字（也会出现在按钮上）
  cost: number; // 初始价格
  rate: number; // 每秒增加量 (qi/sec)
}

// 用你在 Step 8 选的三个升级
const availableItems: Item[] = [
  { name: "Incense Burner",       cost: 10,   rate: 0.1 },
  { name: "Meditation Mat",       cost: 100,  rate: 2.0 },
  { name: "Ancient Spirit Statue", cost: 1000, rate: 50.0 },
];

// 每种物品已购买次数（与 availableItems 一一对应）
const purchasedCounts: number[] = availableItems.map(() => 0);

// 计算某个物品当前价格：基础价格 * 1.15^(购买次数)
function getCurrentCost(index: number): number {
  const base = availableItems[index].cost;
  const count = purchasedCounts[index];
  return base * Math.pow(1.15, count);
}

// ---------- HTML ----------
document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="cultivator in meditation" />
    <div id="counter">0 ${UNIT}</div>
    <div id="rate" class="rate">0.00 ${UNIT}/sec</div>
  </div>

  <div id="shop">
    ${availableItems
      .map(
        (item, index) => `
      <div class="shop-row">
        <button id="buy-${index}" disabled>
          ${item.name} (+${item.rate} ${UNIT}/sec)
          — Cost: <span id="price-${index}">${getCurrentCost(index).toFixed(
          2,
        )}</span> ${UNIT}
        </button>
        <span id="count-${index}" class="count-badge">x0</span>
      </div>
    `,
      )
      .join("")}
  </div>
`;

// ---------- DOM 引用 ----------
const meditate = document.getElementById("meditate") as HTMLDivElement;
const counterDiv = document.getElementById("counter") as HTMLDivElement;
const rateDiv = document.getElementById("rate") as HTMLDivElement;

// 点击打坐：立刻 +1 qi
meditate.addEventListener("click", () => {
  counter += CLICK_GAIN;
  refreshUI();
});

// 循环绑定每个物品对应的购买按钮
availableItems.forEach((item, index) => {
  const btn = document.getElementById(`buy-${index}`) as HTMLButtonElement;

  btn.addEventListener("click", () => {
    const currentCost = getCurrentCost(index);
    if (counter >= currentCost) {
      // 扣钱
      counter -= currentCost;
      // 增加被动增长速率
      growthRate += item.rate;
      // 记录购买次数
      purchasedCounts[index] += 1;
      // 刷新 UI（价格、次数、按钮状态）
      refreshUI();
    }
  });
});

// ---------- UI 更新 ----------
function refreshUI(): void {
  counterDiv.textContent = `${counter.toFixed(2)} ${UNIT}`;
  rateDiv.textContent = `${growthRate.toFixed(2)} ${UNIT}/sec`;

  availableItems.forEach((item, index) => {
    const btn = document.getElementById(
      `buy-${index}`,
    ) as HTMLButtonElement;
    const priceSpan = document.getElementById(
      `price-${index}`,
    ) as HTMLSpanElement;
    const countSpan = document.getElementById(
      `count-${index}`,
    ) as HTMLSpanElement;

    const currentCost = getCurrentCost(index);

    // 更新价格显示和购买次数
    priceSpan.textContent = currentCost.toFixed(2);
    countSpan.textContent = `x${purchasedCounts[index]}`;

    // 是否够买？
    btn.disabled = counter < currentCost;
  });
}

// ---------- 自动增长：requestAnimationFrame ----------
let last = performance.now();

function loop(now: number): void {
  const dt = (now - last) / 1000; // 秒
  last = now;

  // 根据当前 growthRate 增长 qi
  counter += dt * growthRate;
  refreshUI();

  requestAnimationFrame(loop);
}

// 启动
refreshUI();
requestAnimationFrame(loop);
