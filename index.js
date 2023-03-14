const header = document.querySelector("#header");
const container = document.querySelector("#container");
const timeWrapper = document.createElement("div");
timeWrapper.setAttribute("id", "time-wrapper");

container.insertAdjacentElement("beforebegin", timeWrapper);

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
      sortMenu.value = "<--select an option-->";
      sortMenu.addEventListener("change", () => {
        sortNotes();
      });
      const labelForSortMenu = document.createElement("label");
      setAttributes(labelForSortMenu, {
        for: "#sort-menu",
        class: "label-for-sort-menu",
      });
      labelForSortMenu.innerText = "Sort Notes By:";
      timeWrapper.append(labelForSortMenu, sortMenu);

      createSortMethod("<--select an option-->");
      createSortMethod("Date Updated: new to old");
      createSortMethod("Date Updated: old to new");
      createSortMethod("Date Created: new to old");
      createSortMethod("Date Created: old to new");

      const noteButtonWrapper = document.createElement("div");
      noteButtonWrapper.classList.add("wrapper");

      header.append(headerText, moveButton, importButton, exportButton);
      container.append(noteButtonWrapper);

      sortNotes();
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

      const noteContent = document.createElement("div");
      noteContent.setAttribute("id", "note-content");
      noteContent.style.backgroundColor = "#fffa5c";
      noteContent.style.color = "#000000";

      container.append(noteContent);

      const quill = new Quill(noteContent, { theme: "snow" });
      const quillText = noteContent.querySelector("p");

      const editor = document.querySelector(".ql-toolbar.ql-snow");
      editor.style.backgroundColor = "#fffa5c";
      editor.style.border = "0";

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
        editor.style.backgroundColor = colorPicker.value;
      });

      if (note) {
        const timeStamp = document.createElement("p");
        timeStamp.innerText = `Created On: ${note.created} ---- Last Edit: ${note.updated}`;
        timeStamp.classList.add("time-stamp");
        timeWrapper.append(timeStamp);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerText = "delete";
        deleteButton.addEventListener("click", () => {
          trashNote(note);
          deleteNote(note);
        });
        container.append(saveButton, deleteButton);

        titleInput.value = note.title;
        colorPicker.value = note.color;
        quillText.innerHTML = note.content;
        editor.style.backgroundColor = note.color;
        noteContent.style.backgroundColor = note.color;
        noteContent.style.color = hex2rgb(note.color);

        saveButton.innerText = "save";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: quillText.innerHTML,
            color: colorPicker.value,
            created: note.created,
            updated: new Date().toLocaleString("en-US"),
          });
        });
      } else {
        saveButton.innerText = "create";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: quillText.innerHTML,
            color: colorPicker.value,
            created: new Date().toLocaleString("en-US"),
            updated: new Date().toLocaleString("en-US"),
          });
        });
        container.append(saveButton);
      }
      header.append(titleInput, moveButton);
      container.prepend(colorPicker);
    },
  },
  trash: {
    create() {
      const headerText = document.createElement("h1");
      headerText.innerText = "Trash";

      const moveButton = components.moveButton("back", () =>
        changePage("home")
      );

      const noteButtonWrapper = document.createElement("div");
      noteButtonWrapper.classList.add("wrapper");

      header.append(headerText, moveButton);
      container.append(noteButtonWrapper);

      deletedNotes.map((note) => {
        const noteButtonWrapper = document.querySelector(".wrapper");
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
};
