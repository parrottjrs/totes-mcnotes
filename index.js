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
      existing.updated = updatedNote.updated;
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

const hex2rgb = (hex) => {
  const rgb = [
    ("0x" + hex[1] + hex[2]) | 0,
    ("0x" + hex[3] + hex[4]) | 0,
    ("0x" + hex[5] + hex[6]) | 0,
  ];
  if (rgb[0] + rgb[1] + rgb[2] <= 150) {
    return "#ffffff";
  } else {
    return "#000000";
  }
};

const download = (content, fileName, contentType) => {
  const noteToDownload = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  noteToDownload.href = URL.createObjectURL(file);
  noteToDownload.download = fileName;
  noteToDownload.click();
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

      const noteButtonWrapper = document.createElement("div");
      noteButtonWrapper.classList.add("wrapper");

      header.append(headerText, moveButton);
      container.append(noteButtonWrapper);

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
        noteTitle.style.color = hex2rgb(note.color);
        noteElm.appendChild(noteTitle);

        noteButtonWrapper.appendChild(noteElm);
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

      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");

      const colorPicker = document.createElement("input");
      colorPicker.setAttribute("type", "color");
      colorPicker.setAttribute("value", "#fffa5c");
      colorPicker.classList.add("color-picker");

      const noteText = document.createElement("textarea");
      noteText.setAttribute(
        "placeholder",
        "The most important thing I need to do is..."
      );
      noteText.style.backgroundColor = "#fffa5c";
      noteText.style.textDecorationColor = "#000000";

      const importFile = document.createElement("input");
      importFile.setAttribute("type", "file");
      importFile.addEventListener("change", () => {
        const [file] = importFile.files;
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          () => {
            noteText.innerText = reader.result;
          },
          false
        );

        if (file) {
          reader.readAsText(file);
        }
      });

      if (note) {
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", () => {
          deleteNote(note);
        });

        const exportButton = document.createElement("button");
        exportButton.innerText = "export";
        exportButton.classList.add("edit-button");

        exportButton.addEventListener("click", () => {
          download(note.content, `${note.title}.txt`, "text/plain");
        });

        container.append(exportButton, deleteButton);

        titleInput.value = note.title;
        noteText.value = note.content;
        colorPicker.value = note.color;
        noteText.style.backgroundColor = note.color;
        noteText.style.textDecorationColor = hex2rgb(note.color);

        saveButton.innerText = "save";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: noteText.value,
            color: colorPicker.value,
            created: note.created,
            updated: Date().toLocaleString(),
          });
        });
      } else {
        saveButton.innerText = "create";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: noteText.value,
            color: colorPicker.value,
            created: Date().toLocaleString(),
          });
        });
      }
      header.append(titleInput, moveButton);
      container.prepend(colorPicker, noteText, saveButton, importFile);
    },
  },
};
