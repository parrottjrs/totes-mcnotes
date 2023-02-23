// vars
const header = document.querySelector("#header");
const container = document.querySelector("#container");
let h1 = document.createElement("h1");
let moveButton = document.createElement("button");
let saveButton = document.createElement("button");
let titleInput = document.createElement("input");
let note = document.createElement("form");
let noteText = document.createElement("textarea");

// attributes
moveButton.classList.add("move-button");

saveButton.classList.add("save-button");
saveButton.innerText = "save note";

titleInput.setAttribute("type", "text");
titleInput.setAttribute("placeholder", "My New Note...");
titleInput.classList.add("title-input");
noteText.setAttribute("rows", "30");
noteText.setAttribute("cols", "100");
noteText.setAttribute(
  "placeholder",
  "The most important thing I need to do is..."
);
