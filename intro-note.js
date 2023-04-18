const NOTE_COLOR = "#fffa5c";
const NOTE_X = 10;
const NOTE_Y = 10;
const NOTE_SIZE = 125;
const NOTE_WIDTH = NOTE_SIZE;
const NOTE_HEIGHT = NOTE_SIZE;

const introNoteContent = [
  { insert: "Hi, my name is Jordan and Welcome to Totes McNotes!" },
  { attributes: { header: 1 }, insert: "\n" },
  { insert: "\nThis app was made as my first project for " },
  {
    attributes: { link: "https://www.getcoding.ca/" },
    insert: "Get Coding NL",
  },
  {
    insert:
      ". \n\nAs an ADHDer, I sometimes struggle to find the right organizational tools to keep life in order. So what better project was there to do than my very own notes app? \n\nI tackled this project with creativity and freedom in mind. I wanted to make something straightforward and easy to use, but also something more exciting than your run-of-the-mill notes app. And so Totes was born.\n\nRead on to find out how to make the most of your note-making experience. I hope you enjoy using it as much as I did creating it!\n\n",
  },
  { attributes: { bold: true }, insert: "How to use Totes McNotes" },
  { attributes: { header: 2 }, insert: "\n" },
  {
    insert:
      'Using Totes McNotes is easy! Just follow these instructions and you\'ll be a pro in no time. \n\nClick the "new note" button on the home page to create a note. ',
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      "Add a title, fill your note with whatever's on your mind. Use the toolbar to modify your font .",
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      "Use the colour picker above to change the note's colour. Try it out now!",
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Marvel at the pretty colours" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: 'Click "create"' },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Congratulations, you've made your first note! High five!" },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      '\nOnce a new note is created, it will appear on the home page. \n\nIf your notes start piling up in the grid, feel free to sort them using the drop down menu in the header.\n\nYou can edit a note by clicking on it (just like you did this one). The edit page adds the option to delete the note if you no longer have any use for it. \n\n"Where are my notes stored?"',
  },
  { attributes: { header: 2 }, insert: "\n" },
  {
    insert:
      "All notes in Totes are stored in a dragon's stomach deep in the pacific ocean for safe keeping.\n\nJust kidding.\n\nThis app utilizes your browser's local storage. This means your notes are saved to this browser and this browser alone.\n\nDeleting Notes",
  },
  { attributes: { header: 2 }, insert: "\n" },
  { insert: "When you delete a note, it moves into the " },
  { attributes: { bold: true }, insert: '"recently deleted"' },
  { insert: " section. \n\nOnce you're in" },
  { attributes: { bold: true }, insert: " " },
  {
    insert:
      '"recently deleted" you can select notes and either delete or restore them. But beware-- once a note is deleted from this section, there\'s no way to get it back. Be careful!\n\n"What if I want to take my notes elsewhere?"',
  },
  { attributes: { header: 3 }, insert: "\n" },
  {
    insert:
      "I was hoping you'd ask that question! Here's what you want to do:\n\nOpen Totes McNotes in the browser holding the desired notes. ",
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: 'Click "export" on the main page.' },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      'Head to your downloads folder and find a file called "totes mcnotes".',
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Save that file to external storage, such as a flash drive." },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Open Totes in the browser you wish to move to." },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      'Click the import button and select the "totes mcnotes" file from your external storage device.',
  },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Success!" },
  { attributes: { list: "ordered" }, insert: "\n" },
  {
    insert:
      "\nDon't worry about duplicate notes. Totes will fix that up for you during the import process!\n\nNote: this will not bring recently deleted notes. Should it? ",
  },
  {
    attributes: { italic: true },
    insert: "Let me know! (contact details below)",
  },
  { insert: "\n\nNow for my favourite part:" },
  { attributes: { header: 2 }, insert: "\n" },
  { insert: 'Totes McNotes has 2 different "modes". They are:\nGrid, and' },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Canvas" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "\nGrid Mode" },
  { attributes: { header: 3 }, insert: "\n" },
  {
    insert:
      "Grid is the default mode for Totes. It organizes your notes in...well...a grid. Every time you create or save a note, it will appear in the top left-most corner of the grid for ease of access. The sort menu can be used to rearrange them based on certain criteria.\n\nCanvas Mode",
  },
  { attributes: { header: 3 }, insert: "\n" },
  {
    insert:
      "*Note: At the moment, Canvas mode is not fully functional on touch screens.\n\nThis is the part where I had the most fun during creation. This is the mode that embodies the energy that Totes McNotes really wants to get across. \n\nPut simply, canvas mode gives you the freedom to drag and drop your notes wherever you want on the cork board. The little plus sign in the top left of each note is your edit button. \n\nYou can also drag notes into the trash bin at the bottom of the screen. Double click on the bin to open your recently deleted notes!\n\nApart from these few differences, everything works just like in grid mode.\n\nThings and people that made Totes McNotes possible:",
  },
  { attributes: { header: 2 }, insert: "\n" },
  { insert: "HTML" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "CSS" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Javascript" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { attributes: { link: "https://quilljs.com" }, insert: "Quilljs" },
  { insert: " for this sweet text editor" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Google Fonts" },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "Chris Courses on Youtube for the canvas tutorials." },
  { attributes: { list: "ordered" }, insert: "\n" },
  { insert: "\nAlso a huge thanks to " },
  { attributes: { link: "https://jackharrhy.com/" }, insert: "Jack Harrhy" },
  {
    insert:
      ", my coach at Get Coding. Without him, this app would likely not exist.\n\nAnd thanks to you for reading!",
  },
  { attributes: { header: 2 }, insert: "\n" },
  {
    insert:
      "If you made it to the end, congratulations! Your prize is a healthy dose of self satisfaction. Can you feel it? Now go make some notes. Put them out into the world and let them fly, or whatever it is that notes do.\n\nEnjoy!\n\n-Jordan Parrott\n\ne-mail: parrottjrs@gmail.com\ninstagram & twitter: @aparrotwithadhd\n\n",
  },
];

const introNote = {
  title: "Click Me!",
  content: introNoteContent,
  color: NOTE_COLOR,
  created: new Date().toLocaleString("en-US"),
  updated: new Date().toLocaleString("en-US"),
  moved: new Date().toLocaleString("en-US"),
  x: NOTE_HEIGHT,
  y: NOTE_SIZE,
  width: NOTE_WIDTH,
  height: NOTE_HEIGHT,
};

export { NOTE_COLOR, NOTE_X, NOTE_Y, NOTE_WIDTH, NOTE_HEIGHT, introNote };
