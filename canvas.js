const CanvasNote = (canvas, c, note) => {
  const draw = () => {
    c.beginPath();
    c.fillStyle = note.color;
    c.fillRect(note.x, note.y, note.width, note.height);
    c.strokeRect(note.x, note.y, note.width, note.height);
    c.font = "20px arial";
    c.fillStyle = hex2rgb(note.color);
    c.fillText("+", note.x + 3, note.y + 17);
  };

  const update = () => {
    if (note.x < 0) {
      note.x = -note.x;
    }
    if (note.x + note.width > window.innerWidth) {
      note.x = window.innerWidth - note.width;
    }
    if (note.y < 0) {
      note.y = -note.y;
    }
    if (note.y + note.height > window.innerHeight) {
      note.y = window.innerHeight - note.height;
    }
    draw();
  };
  return {
    note,
    draw,
    update,
  };
};

const canvasNoteFromCoords = (canvasNotes, x, y) => {
  return [...canvasNotes]
    .reverse()
    .find(
      ({ note }) =>
        x < note.x + note.width &&
        x > note.x &&
        y < note.y + note.height &&
        y > note.y
    );
};
