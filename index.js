import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-30a13-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const confirmDeleteEl = document.getElementById("confirm-delete");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let deleteConfirmEl = document.createElement("p");
    let deleteItemEl = document.createElement("span");
    let deleteBtnEl = document.createElement("div");
    let btnYesEl = document.createElement("button");
    let btnNoEl = document.createElement("button");

    deleteConfirmEl.innerHTML = `Would you like to delete "<span class="item-txt">${newEl.textContent}</span>"?`;
    btnYesEl.textContent = "Yes";
    btnNoEl.textContent = "No";

    deleteBtnEl.className = "delete-btns";
    btnYesEl.className = "yes-btn";
    btnNoEl.className = "no-btn";
    deleteConfirmEl.className = "confirm-txt";

    btnYesEl.addEventListener("click", function () {
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

      remove(exactLocationOfItemInDB);

      deleteConfirmEl.remove();
      deleteBtnEl.remove();
    });
    btnNoEl.addEventListener("click", function () {
      deleteConfirmEl.remove();
      deleteBtnEl.remove();
    });

    deleteBtnEl.appendChild(btnYesEl);
    deleteBtnEl.appendChild(btnNoEl);
    confirmDeleteEl.appendChild(deleteConfirmEl);
    confirmDeleteEl.appendChild(deleteBtnEl);
  });

  shoppingListEl.append(newEl);
}
