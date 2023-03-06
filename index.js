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

const exportNote = (content, fileName, contentType) => {
  const noteToDownload = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  noteToDownload.href = URL.createObjectURL(file);
  noteToDownload.download = fileName;
  noteToDownload.click();
};

const importFileToNote = () => {
  noteToImport = document.querySelector("#import-field");
  noteContent = document.querySelector("#note-content");
  const [file] = noteToImport.files;
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      noteContent.innerText = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsText(file);
  }
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

      const noteContent = document.createElement("textarea");
      noteContent.setAttribute("id", "note-text");
      noteContent.setAttribute(
        "placeholder",
        "The most important thing I need to do is..."
      );
      noteContent.style.backgroundColor = "#fffa5c";
      noteContent.style.textDecorationColor = "#000000";

      const importField = document.createElement("input");
      importField.setAttribute("type", "file");
      importField.setAttribute("id", "import-field");
      importField.addEventListener("change", () => {
        importFileToNote();
      });

      if (note) {
        const deleteButton = components.moveButton("delete", () => {
          deleteNote(note);
        });

        const exportButton = components.moveButton("export", () => {
          exportNote(note.content, `${note.title}.txt`, "text/plain");
        });
        exportButton.classList.add("edit-button");

        container.append(exportButton, deleteButton);

        titleInput.value = note.title;
        colorPicker.value = note.color;
        noteContent.value = note.content;
        noteContent.style.backgroundColor = note.color;
        noteContent.style.textDecorationColor = hex2rgb(note.color);

        saveButton.innerText = "save";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: noteContent.value,
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
            content: noteContent.value,
            color: colorPicker.value,
            created: Date().toLocaleString(),
          });
        });
      }
      header.append(titleInput, moveButton);
      container.prepend(colorPicker, noteContent, saveButton, importField);
    },
  },
};
