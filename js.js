"use strict";
const containerMovements = document.querySelector(".transfer");
const currentBalance = document.querySelector(".bank-balance__value");
const btnLogin = document.querySelector(".nav-btn");
const loginField = document.querySelector(".nav-user");
const password = document.querySelector(".nav-password");
const welcomeMessage = document.querySelector(".nav-welcome");
const btnTransfer = document.querySelector(".form-transfer__button");
const transferTo = document.querySelector(".form-transfer__to");
const transferAmount = document.querySelector(".form-transfer__amount");
const summaryIn = document.querySelector(".summary-in__value");
const summaryOut = document.querySelector(".summary-out__value");

async function loadAccounts() {
  const response = await fetch("./accounts.JSON");
  const accounts = await response.json();
  const createUserNames = (user) => {
    accounts.account.forEach((acc) => {
      acc.userName = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    });
  };
  createUserNames(accounts);

  let currentAccount;

  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    currentAccount = accounts.account.find(
      (acc) => acc.userName === loginField.value
    );

    currentAccount?.pin === Number(password.value) ? login() : wrongDetails();
  });

  const login = (transfer) => {
    updateUI();

    welcomeMessage.textContent = `Welcome, ${currentAccount.owner}`;
  };
  const displayTransfers = function transfers() {
    currentAccount.transfers.forEach((mov, i) => {
      const type = mov > 0 ? `in` : `out`;
      const html = `        <div class="transfer__column">
  <div class="transfer__type transfer__type--${type}">${i + 1} ${type}</div>
  <div class="transfer__value">${Math.abs(mov).toFixed(2)}£</div>
</div>`;
      containerMovements.insertAdjacentHTML(`afterbegin`, html);
    });
  };
  const calcDisplaySummary = function (acc) {
    const incomes = acc.transfers
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    summaryIn.textContent = `${incomes.toFixed(2)} £`;

    const out = acc.transfers
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    summaryOut.textContent = `${Math.abs(out).toFixed(2)}£`;
  };

  const wrongDetails = function (acc) {
    welcomeMessage.textContent = `wrong  username or password`;
  };

  const calcPrintBalance = function (acc) {
    acc.balance = acc.transfers.reduce((acc, mov) => acc + mov, 0);
    currentBalance.textContent = `${acc.balance.toFixed(2)} £`;
  };
  btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    const amount = Number(transferAmount.value);
    const reciver = accounts.account.find(
      (acc) => acc.userName === transferTo.value
    );

    if (
      amount > 0 &&
      currentAccount.balance >= amount &&
      reciver?.userName !== currentAccount.userName
    ) {
      currentAccount.transfers.push(-amount);
      reciver.transfers.push(amount);
      alert(`${amount}£ to ${reciver.owner} was sent successfully`);
      updateUI();
    }
  });
  const updateUI = (update) => {
    containerMovements.innerHTML = " ";
    calcPrintBalance(currentAccount);
    calcDisplaySummary(currentAccount);
    displayTransfers(currentAccount);
  };
}
loadAccounts();
