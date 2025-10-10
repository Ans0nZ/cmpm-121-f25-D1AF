import exampleIconUrl from "./dazuo.png";
import "./style.css";

let counter = 0;
let costcounter = 0;

document.body.innerHTML = `
  <p>Buttom: <img src="${exampleIconUrl}" class="icon" /></p>
  
`;

for (let i = 0; i < 4; i++) {
  counter++;
  costcounter++;
}
