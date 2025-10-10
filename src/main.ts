import exampleIconUrl from "./dazuo.png";
import flameIconUrl from "./lingqi.png";
import "./style.css";

let counter: number = 0;
const UNIT = "qi";

document.body.innerHTML = `
  <div id="meditate" class="meditate">
    <img src="${exampleIconUrl}" class="icon" alt="meditator" />
    <img src="${flameIconUrl}" id="flame" class="flame" alt="flame" />
  </div>
  
`;

for (let i = 0; i < 4; i++) {
  counter++;
  costcounter++;
}
