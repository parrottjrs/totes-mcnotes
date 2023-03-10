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

      const exportButton = components.moveButton("export", () =>
        exportNote(JSON.stringify(notes), "Totes McNotes")
      );

      const importButton = components.moveButton("import", () => {
        importTotesMcNotes();
      });

      const sortMenu = document.createElement("select");
      sortMenu.setAttribute("id", "sort-menu");
      sortMenu.addEventListener("change", () => {
        sortNotes();
      });
      const labelForSortMenu = document.createElement("label");
      setAttributes(labelForSortMenu, {
        for: "#sort-menu",
        class: "label-for-sort-menu",
      });
      labelForSortMenu.innerText = "Sort Notes By:";
      container.append(labelForSortMenu, sortMenu);

      createSortMethod("<--select an option-->");
      createSortMethod("Date Updated: new to old");
      createSortMethod("Date Updated: old to new");
      createSortMethod("Date Created: new to old");
      createSortMethod("Date Created: old to new");

      const noteButtonWrapper = document.createElement("div");
      noteButtonWrapper.classList.add("wrapper");

      header.append(headerText, moveButton, importButton, exportButton);
      container.append(noteButtonWrapper);

      createNoteButtons();
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

        container.append(deleteButton);

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
        saveButton.innerText = "create";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: noteContent.value,
            color: colorPicker.value,
            created: Date().toLocaleString(),
            updated: Date().toLocaleString(),
          });
        });
      }
      header.append(titleInput, moveButton);
      container.prepend(colorPicker, noteContent, saveButton);
    },
  },
};
