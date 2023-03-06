const header = document.querySelector("#header");
const container = document.querySelector("#container");

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
      setAttributes(titleInput, {
        type: "text",
        placeholder: "My New Note...",
      });
      titleInput.classList.add("title-input");

      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");

      const colorPicker = document.createElement("input");
      setAttributes(colorPicker, {
        id: "color-picker",
        type: "color",
        value: "#fffa5c",
      });
      colorPicker.addEventListener("change", () => {
        const colorPicker = document.getElementById("color-picker");
        const noteContent = document.getElementById("note-content");
        noteContent.style.backgroundColor = colorPicker.value;
        noteContent.style.color = hex2rgb(colorPicker.value);
        console.log(hex2rgb(colorPicker.value));
      });

      const noteContent = document.createElement("textarea");
      setAttributes(noteContent, {
        id: "note-content",
        placeholder: "The most important thing I need to do is...",
      });

      noteContent.style.backgroundColor = "#fffa5c";
      noteContent.style.color = "#000000";

      if (note) {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerText = "delete";
        deleteButton.addEventListener("click", () => {
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
        noteContent.style.color = hex2rgb(note.color);

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
        const labelForImport = document.createElement("label");
        labelForImport.setAttribute("for", "import-field");
        labelForImport.classList.add("label-for-import");
        labelForImport.innerText = "import";

        const importField = document.createElement("input");
        setAttributes(importField, { type: "file", id: "import-field" });
        importField.addEventListener("change", () => {
          importFileToNote();
        });

        container.append(labelForImport, importField);

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
      container.prepend(colorPicker, noteContent, saveButton);
    },
  },
};
