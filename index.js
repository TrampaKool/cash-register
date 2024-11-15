let price = 19.5;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

const cashValues = [
  0.01,
  0.05,
  0.1,
  0.25,
  1,
  5,
  10,
  20,
  100
];
let drawerSum;

const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const total = document.getElementById("total-span");
const drawerTotal = document.getElementById("drawer-total");
const priceSpan = document.getElementById("price");
const drawerSpans = document.querySelectorAll(".drawer-span");

const displayDrawer = (arr) => {
  /**
   * Takes an array with
   * drawer values and
   * displays the drawer
   * and its total.
   */
  let sum = 0;
  arr.forEach((el, index) => {
    drawerSpans[index].textContent = el[1];
    sum += el[1];
  });
  drawerTotal.textContent = sum.toFixed(2);
  drawerSum = Number(sum.toFixed(2));
}

const isValidInput = (str) => {
  /**
   * Takes the input value as
   * a string and returns true
   * if the value is valid, false
   * otherwise.
   */
  const regex = /\d+\.?\d*|\.\d{1,2}/;

  return regex.test(str);
}

const calculateChange = (change) => {
  /**
   * Takes the change as a float and
   * displays change. Also updates
   * the drawer
   */
  if (change > drawerSum) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  } 
  if (change == 0) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  }
  console.log(change, drawerSum);
  if (change === drawerSum) {
    changeDue.textContent = "Status: CLOSED";
  } else {
    changeDue.textContent = "Status: OPEN";
  }
  const counts = cashValues.map(() => null);

  for (let i = cid.length - 1;i >= 0;i--) {
    let count = 0;
    const remaining = cid[i][1] / cashValues[i];

    while (change - cashValues[i] >= 0 && remaining > count) {
      change = Number((change - cashValues[i]).toFixed(2));
      count++;
    }
    if (count) {
      changeDue.innerHTML += `<br>${cid[i][0]}: $<strong>${Number((cashValues[i] * count).toFixed(2))}</strong>`;
    }
    counts[i] = count;
  }

  if (change != 0) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  counts.forEach((count, index) => cid[index][1] = Number((cid[index][1] - count * cashValues[index]).toFixed(2)));
  displayDrawer(cid);
}

priceSpan.textContent = price;
displayDrawer(cid);

purchaseBtn.addEventListener("click", () => {
  displayDrawer(cid);
  const custCash = cashInput.value;
  cashInput.value = "";

  if (!isValidInput(custCash)) {
    alert("Please enter a valid input");
    return;
  }
  const cashFloat = Number(parseFloat(custCash).toFixed(2));

  if (cashFloat < price) {
    alert("Customer does not have enough money to purchase the item")
    return;
  }
  total.textContent = cashFloat;
  const change = Number((cashFloat - price).toFixed(2));

  calculateChange(change);
});