let price = 19.5;
document.querySelector("#price-screen").innerText = price;
let cid = [
  ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["HUNDREDS", 100]
];
const drawerDisplay = document.querySelector('#cash-drawer-display');
const renderCid = () => {
  drawerDisplay.innerHTML = `<p><b>Change in drawer</b></p>`;
  cid.forEach(([coin, amnt]) => {
    drawerDisplay.innerHTML += `<p>${coin}: $${amnt.toFixed(2)}</p>`;
  });
  return;
}
renderCid();
const units = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "HUNDREDS": 100,
}
const cashInput = document.querySelector('#cash');
const cashBtn = document.querySelector('#purchase-btn');
const changeDue = document.querySelector("#change-due");
cashBtn.addEventListener('click', ()=>{
  const cash = parseFloat(cashInput.value);
  cashInput.value = null;
  if(!cash) {
    alert("Please enter a number");
    return;
  }
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if (cash === price) {
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }
  const change = getChange(cash-price);
  if (!change) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  updateCid(change);
  if (cid.every(arr=>!arr[1]||!parseFloat(arr[1].toFixed(2)))) {
    changeDue.innerText = "Status: CLOSED";
  }
  else {
    changeDue.innerText = "Status: OPEN";
  }
  change.forEach((v, i) => {
    if (v !== 0) {
      let amnt = (v*units[cid[i][0]]).toFixed(2);
      if (amnt[amnt.length-1] === '0') {
        amnt = (v*units[cid[i][0]]).toFixed(1);
      }
      if (amnt[amnt.length-1] === '0') {
        amnt = (v*units[cid[i][0]]).toFixed(0);
      }
      changeDue.innerHTML += `<br /><p>${cid[i][0]}: $${amnt}</p>`
    }
  })
  renderCid();
  return;
})

const getChange = (cash) => {
  cash = cash.toFixed(2);
  let toPay = []
  for(let i=0;i<cid.length;i++) {
    toPay.push(0);
  }
  let i = cid.length-1
  while (cash > 0 && i >= 0) {
    const unit = units[cid[i][0]]
    let have = cid[i][1]
    while (unit <= cash && have > 0) {
      have -= unit;
      cash = (cash-unit).toFixed(2);
      toPay[i]++;
    }
    i--;
  }
  if (parseFloat(cash) === 0) {
    return toPay;
  }
  return null;
}

const updateCid = (unitsToPay) => {
  unitsToPay.forEach((v, i)=>cid[i][1] -= parseFloat((v*units[cid[i][0]]).toFixed(2)));
  cid = cid.map(([coin, amnt])=>[coin, Math.max(amnt, 0)]);
  return;
}
