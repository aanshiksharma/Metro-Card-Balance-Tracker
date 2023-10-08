// Constants
const tableBody = document.getElementsByTagName("tbody");
const navbar = document.querySelector(".navbar");

const _navbarToggleButtons = document.querySelectorAll(".navbarToggler");
const navbarToggleButtons = Array.from(_navbarToggleButtons);

// Routing Constants
const _routingButtons = document.querySelectorAll(".primary-navigation .btn");
const routingButtons = Array.from(_routingButtons);

const dashboard = document.querySelector(".dashboard");
const manageTransactionsSection = document.querySelector(
  ".manage-transactions-section"
);

// Dialog Box Container
const dialogBoxContainer = document.querySelector(".dialog-box-container");

// Individual Toggle Buttons
const _addTransactionButton = document.querySelectorAll(
  ".addTransactionButton"
);
const addTransactionButton = Array.from(_addTransactionButton);

// Individual Dialog Boxes
const addTransactionBox = document.querySelector(".add-transaction-box");

// Variable
let isValid = false;

// Functions
function addData(
  dateInput,
  transactionInput,
  transactionType,
  currentBalance,
  data
) {
  // Getting the date when a transaction is being added
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // If the user has input a date, it is set as the final date otherwise the current date is considered
  let date;

  if (dateInput) {
    dateInput = formatDate(dateInput);
    date = dateInput;
  } else {
    if (parseInt(day) < 10) date = `0${day}/${month}/${year}`;
    else date = `${day}/${month}/${year}`;
  }

  // Getting the transaction amount
  let transaction = transactionInput;
  if (transactionType === "expense") {
    transaction = transaction * -1;
  }

  // Calculating the balance amount
  let balance = currentBalance;
  balance = balance + transaction;

  localStorage.setItem("Current Balance", balance);

  // Saving data to local storage

  data.push({
    date: date,
    transaction: transaction,
    balance: balance,
  });

  data = sortLocalStorage(data);

  showData(true);

  // Closing the Dialog Boxes
  dialogBoxContainer.classList.add("hidden");
  addTransactionBox.classList.add("hidden");
}

function deleteData() {}

function editData() {}

function showData() {
  let data = JSON.parse(localStorage.getItem("Metro Card Data") || "[]");
  tableBody[0].innerHTML = "";
  let i = 0;
  while (i < data.length && i < 5) {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");

    td1.innerHTML = data[i].date;
    if (data[i].transaction > 0) {
      td2.innerHTML = `+${data[i].transaction}`;
      td2.style.color = "var(--clr-recharge)";
    } else {
      td2.innerHTML = `- ${data[i].transaction * -1}`;
      td2.style.color = "var(--clr-expense)";
    }
    td3.innerHTML = data[i].balance;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    tableBody[0].appendChild(tr);
    i++;
  }

  data.forEach((obj) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");

    td1.innerHTML = obj.date;
    if (obj.transaction > 0) {
      td2.innerHTML = `+${obj.transaction}`;
      td2.style.color = "var(--clr-recharge)";
    } else {
      td2.innerHTML = `- ${obj.transaction * -1}`;
      td2.style.color = "var(--clr-expense)";
    }
    td3.innerHTML = obj.balance;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    tableBody[1].appendChild(tr);
  });
}

function submitForm(e) {
  e.preventDefault();
  let form = e.target;
  let data = new FormData(form);

  let formDataJSON = {};
  data.forEach((value, key) => {
    formDataJSON[key] = value;
  });

  // Checking if the transaction is valid or not
  isValid = transactionValidation(formDataJSON.transaction);

  if (!isValid) {
    console.log("error");
  } else {
    console.log(formDataJSON); // Remove afterwards

    e.target.reset();

    let data = localStorage.getItem("Metro Card Data") || "[]";
    let currentBalance = localStorage.getItem("Current Balance") || "0";

    data = JSON.parse(data);
    data = sortLocalStorage(data);
    console.log(data);

    currentBalance = parseInt(currentBalance);
    console.log(currentBalance);

    addData(
      formDataJSON.date,
      parseInt(formDataJSON.transaction),
      formDataJSON.transactionType,
      currentBalance,
      data
    );
  }
}

function transactionValidation(transaction) {
  // Code Snippet from ChatGPT
  const validChars = /^[0-9]+$/; // A regular expression to match only digits
  return validChars.test(transaction);
}

function sortLocalStorage(data) {
  data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Code by Chat GPT
  localStorage.setItem("Metro Card Data", JSON.stringify(data));
  return JSON.parse(localStorage.getItem("Metro Card Data"));
}

function formatDate(dateInput) {
  const parts = dateInput.split("-");
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return formattedDate;
}

// Logics

showData();

// Toggling the visibility of the navbar as per the clicks.
navbarToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navbar.classList.toggle("navbar-visible");
  });
});

// Hide Dialog Boxes on clicking the cross button
addTransactionButton.forEach((button) => {
  button.addEventListener("click", () => {
    dialogBoxContainer.classList.toggle("hidden");
    addTransactionBox.classList.toggle("hidden");
  });
});

// Routing
routingButtons.forEach((button, index, array) => {
  button.addEventListener("click", () => {
    // Toggling Active Class in all the Route Buttons
    array.forEach((element) => {
      element.classList.remove("active");
    });
    button.classList.add("active");

    // Toggling Hidden Class for respective Sections
    dashboard.classList.add("hidden");
    manageTransactionsSection.classList.add("hidden");
    switch (index) {
      case 0:
        dashboard.classList.toggle("hidden");
        break;

      case 1:
        manageTransactionsSection.classList.toggle("hidden");
        break;

      default:
        break;
    }
  });
});

// Buttons Logics

/* Schema :-
[
    {
        date: date,
        transaction: number,
        balance: number,
    },
    {
        date: date,
        transaction: number,
        balance: number,
    },
    {
        date: date,
        transaction: number,
        balance: number,
    }
]
*/
