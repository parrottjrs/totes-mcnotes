// ******* ******* ****
// creates landing page
// ******* ******* ****

function openHomePage() {
  h1.innerText = "Notes";
  moveButton.innerText = "+ new note";
  header.append(h1, moveButton);
  moveButton.addEventListener("click", () => {
    newNote();
  });
}

// ******** ******* **** ******** **** **** ******** ********
// replaces landing page elements with note creation elements
// ******** ******* **** ******** **** **** ******** ********

function newNote() {
  h1.remove();
  moveButton.innerText = "back";
  header.prepend(titleInput);
  container.append(noteText, saveButton);
  moveButton.addEventListener("click", () => {
    backToHome();
  });
}

// ******* ** ******* **** **** *** **** ***** *** ****
// returns to landing page with new note added (if any)
// ******* ** ******* **** **** *** **** ***** *** ****

function backToHome() {
  titleInput.remove();
  noteText.remove();
  saveButton.remove();
  h1.innerText = "Notes";
  moveButton.innerText = "+ new note";
  header.prepend(h1);
  moveButton.addEventListener("click", () => {
    newNote();
  });
}
