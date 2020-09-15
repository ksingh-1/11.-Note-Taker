//Variables Defined
var $titleNote = $(".note-title");
var $textNote = $(".note-textarea");
var $noteSaveBtn = $(".save-note");
var $noteNewBtn = $(".new-note");
var $listNote = $(".list-container .list-group");

// noteActive Keeps Track Of The Note In The Textarea
var noteActive = {};

// Function For Getting All Notes From The DB
var getNote = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// Function For Saving Notes To DB
var noteSave = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// Function For Deleting Notes From DB
var noteDelete = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If noteActive Is Active, Display It. Otherwise Render Empty Inputs.
var activeNoteRender = function() {
  $noteSaveBtn.hide();

  if (noteActive.id) {
    $titleNote.attr("readonly", true);
    $textNote.attr("readonly", true);
    $titleNote.val(noteActive.title);
    $textNote.val(noteActive.text);
  } else {
    $titleNote.attr("readonly", false);
    $textNote.attr("readonly", false);
    $titleNote.val("");
    $textNote.val("");
  }
};

// Get Note Data From The Inputs, Save It To The DB Then Update View
var handleNoteSave = function() {
  var newNote = {
    title: $titleNote.val(),
    text: $textNote.val()
  };

  noteSave(newNote).then(function(data) {
    getAndRenderNotes();
    activeNoteRender();
  });
};

// Delete The Note Clicked On
var handleNoteDelete = function(event) {
  //Prevents the List Click Listener From Being Called Button Is Clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (noteActive.id === note.id) {
    noteActive = {};
  }

  noteDelete(note.id).then(function() {
    getAndRenderNotes();
    activeNoteRender();
  });
};

// Sets noteActive then Displays It
var handleNoteView = function() {
  noteActive = $(this).data();
  activeNoteRender();
};

// Sets The noteActive To Empty Object then Lets User To Enter A New Note
var handleNewNoteView = function() {
  noteActive = {};
  activeNoteRender();
};

// If A Note's Title or Text Are Empty, Hide The Save Button
var handleRenderSaveBtn = function() {
  if (!$titleNote.val().trim() || !$textNote.val().trim()) {
    $noteSaveBtn.hide();
  } else {
    $noteSaveBtn.show();
    // Or else show it
  }
};

// Render List Of Note Titles
var renderlistNote = function(notes) {
  $listNote.empty();

  var listNoteItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    listNoteItems.push($li);
  }

  $listNote.append(listNoteItems);
};

// Gets Notes From db.json And Renders Them To The Sidebar
var getAndRenderNotes = function() {
  return getNote().then(function(data) {
    renderlistNote(data);
  });
};

$noteSaveBtn.on("click", handleNoteSave);
$listNote.on("click", ".list-group-item", handleNoteView);
$noteNewBtn.on("click", handleNewNoteView);
$listNote.on("click", ".delete-note", handleNoteDelete);
$titleNote.on("keyup", handleRenderSaveBtn);
$textNote.on("keyup", handleRenderSaveBtn);

// Gets + Renders Initial List Of Notes
getAndRenderNotes();
