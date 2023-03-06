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

const setAttributes = (elm, attributes) => {
  for (const key in attributes) {
    elm.setAttribute(key, attributes[key]);
  }
};

const changePage = (pageKey, arg) => {
  clear();
  pages[pageKey].create(arg);
};
