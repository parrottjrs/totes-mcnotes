function openHomePage() {
  h1.innerText = "Notes";
  btn.innerText = "+ new note";
  header.append(h1, btn);
}

function newNote() {
  header.removeChild(h1);
  btn.innerText = "back";
  header.prepend(title);
  title.setAttribute("placeholder", "My New Note...");
  title.setAttribute("class", "title");
}
