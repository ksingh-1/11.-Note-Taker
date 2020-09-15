const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
// port assigned 
const port = 3000;
// link to main directory
const mainDir = path.join(__dirname, "./Develop/public");

// link to CSS location
app.use(express.static('./Develop/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// pulls notes html file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

// link to pull notes json file from directory
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/db/db.json"));
});

// determines how the user's input will be outputted into the json file.
app.get("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

// pulls index file from main directory
app.get("*", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    console.log("Your notes have been saved to db.json. The content consists of: ", newNote);
    res.json(savedNotes);
})
// created backend for deleting notes created.
app.delete("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleted note with ID of: ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(port, function () {
    console.log(`Now listening to port ${port}. Note Taker App Ready To Be Used!`);
})