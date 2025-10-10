import exampleIconUrl from "./dazuo.png";
import "./style.css";

let counter: number = 0;
const UNIT = "qi";

document.body.innerHTML = `
  <p>
    <button id="increment">
     <img src="${exampleIconUrl}" class="icon" />
    </button>
  </p>
    <div id="counter">0 ${UNIT}</div>
    <div id="message"></div>
  
`;

const button = document.getElementById("increment")!;
const counterDiv = document.getElementById("counter")!;
const messageDiv = document.getElementById("message")!;

button.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} ${UNIT}`;
  messageDiv.textContent = "灵气 +1";

  setTimeout(() => {
    messageDiv.textContent = "";
  }, 800);
});
