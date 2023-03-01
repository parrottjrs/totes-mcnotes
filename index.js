const header = document.querySelector("#header");
const container = document.querySelector("#container");

const getNotes = () => {
  const maybeNotes = localStorage.getItem("notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let notes = getNotes();

const saveNote = (updatedNote) => {
  if (updatedNote.title === "") {
    alert("Your note needs a title!");
  } else {
    const existing = notes.find((note) => note.id == updatedNote.id);

    if (existing) {
      existing.title = updatedNote.title;
      existing.content = updatedNote.content;
      existing.color = updatedNote.color;
    } else {
      updatedNote.id = Math.floor(Math.random() * 100000);
      notes.push(updatedNote);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    changePage("home");
  }
};

const deleteNote = (noteToDelete) => {
  notes = notes.filter((note) => note.id != noteToDelete.id);

  localStorage.setItem("notes", JSON.stringify(notes));
  changePage("home");
};

const clear = () => {
  header.innerHTML = "";
  container.innerHTML = "";
};

const components = {
  moveButton(text, onClick) {
    const moveButton = document.createElement("button");
    moveButton.innerText = text;
    moveButton.classList.add("move-button");
    moveButton.addEventListener("click", onClick);
    return moveButton;
  },
};

const changePage = (pageKey, arg) => {
  clear();
  pages[pageKey].create(arg);
};

const pages = {
  home: {
    create() {
      const headerText = document.createElement("h1");
      headerText.innerText = "Notes";

      const moveButton = components.moveButton("+ new note", () =>
        changePage("note")
      );

      header.append(headerText, moveButton);

      notes.map((note) => {
        const noteElm = document.createElement("button");
        noteElm.classList.add("note-button");
        noteElm.style.backgroundColor = note.color;

        noteElm.addEventListener("click", () => {
          clear();
          pages.note.create(note);
        });

        const noteTitle = document.createElement("p");
        noteTitle.innerText = note.title;
        noteElm.appendChild(noteTitle);

        container.appendChild(noteElm);
      });
    },
  },
  note: {
    create(note) {
      const moveButton = components.moveButton("back", () =>
        changePage("home")
      );

      const titleInput = document.createElement("input");
      titleInput.setAttribute("type", "text");
      titleInput.setAttribute("placeholder", "My New Note...");
      titleInput.classList.add("title-input");

      const noteText = document.createElement("textarea");
      noteText.setAttribute(
        "placeholder",
        "The most important thing I need to do is..."
      );

      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");

      const colorPicker = document.createElement("input");
      colorPicker.setAttribute("type", "color");
      colorPicker.classList.add("color-picker");

      if (note) {
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", () => {
          deleteNote(note);
        });

        container.append(deleteButton);

        titleInput.value = note.title;
        noteText.value = note.content;
        colorPicker.value = note.color;

        saveButton.innerText = "save";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: titleInput.value,
            color: colorPicker.value,
          });
        });
      } else {
        saveButton.innerText = "create";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: noteText.value,
            color: colorPicker.value,
          });
        });
      }

      header.append(titleInput, moveButton);
      container.prepend(colorPicker, noteText, saveButton);
    },
  },
};
