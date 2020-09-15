const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
//Port Number 
const port = 3000;
//Link To Main Directory
const mainDir = path.join(__dirname, "./Develop/public");

//Link to Css Location
app.use(express.static('./Develop/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Pull HTML Note File
app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

//Path To Pull Notes JSON From Folder
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/db/db.json"));
});

//Gets User Info To Put In Directory
app.get("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

//Gets Index File From Main Directory
app.get("*", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});
//Posts Notes Stored In Local History
app.post("/api/notes", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);
    //Writes File to page
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    console.log("Your notes have been saved to db.json. The content consists of: ", newNote);
    res.json(savedNotes);
})
//Deletes Notes From Backend History
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
    //Write New Note To Develop File
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})
//App Ready To Use On Certain Port
app.listen(port, function () {
    console.log(`Now listening to port ${port}. Note Taker App Ready To Be Used!`);
})