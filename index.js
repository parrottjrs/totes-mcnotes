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

const notes = getNotes();

const saveNote = (updatedNote) => {
  const notes = getNotes();

  const existing = notes.find((note) => note.id == updatedNote.id);

  if (existing) {
    existing.title = updatedNote.title;
    existing.content = updatedNote.content;
  } else {
    updatedNote.id = Math.floor(Math.random() * 1000000);
    notes.push(updatedNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
  changePage("home");
  window.location.reload();
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
      noteText.setAttribute("rows", "25");
      noteText.setAttribute("cols", "75");
      noteText.setAttribute(
        "placeholder",
        "The most important thing I need to do is..."
      );

      const saveButton = document.createElement("button");
      saveButton.classList.add("save-button");

      if (note) {
        note.id = note.id;
        titleInput.value = note.title;
        noteText.value = note.content;

        saveButton.innerText = "save note";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: noteText.value,
          });
        });
      } else {
        saveButton.innerText = "create note";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: noteText.value,
          });
        });
      }

      header.append(titleInput, moveButton);
      container.append(noteText, saveButton);
    },
  },
};
