const NOTE_SIZE = 100;
const NOTE_WIDTH = NOTE_SIZE;
const NOTE_HEIGHT = NOTE_SIZE;

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
    if (note.x + NOTE_WIDTH > window.innerWidth) {
      note.x = window.innerWidth - note.width;
    }
    if (note.y < 0) {
      note.y = -note.y;
    }
    if (note.y + NOTE_HEIGHT > window.innerHeight) {
      note.y = window.innerHeight - NOTE_HEIGHT;
    }
    draw();
  };
  return {
    note,
    draw,
    update,
  };
};

const getDistance = (x1, x2, width, y1, y2, height) => {
  const distanceX1 = x2 - (x1 + width);
  const distanceX2 = x1 - (x2 + width);
  const distanceY1 = y2 - (y1 + height);
  const distanceY2 = y1 - (y2 + height);

  return { distanceX1, distanceX2, distanceY1, distanceY2 };
};

const canvasNoteFromCoords = (canvasNotes, x, y) => {
  return [...canvasNotes]
    .reverse()
    .find(
      ({ note }) =>
        x < note.x + NOTE_WIDTH &&
        x > note.x &&
        y < note.y + NOTE_HEIGHT &&
        y > note.y
    );
};
