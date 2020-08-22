const express = require("express");
const fs=require("fs");
const path=require("path");
const newNotes=require("./db/db.json");
const direct=path.join(__dirnamme, "public");

const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(direct, "notes.html"));
});
app.post("/api/notes", function (req, res) {
    newNotes.push(req.body);
    newNotes.forEach(function (item, i) {
        item.id=i+1;
    });
app.delete("/api/notes/:id", function (req, res){
    newNotes.splice(newNotes.findIndex((i) => i.id == req.params.id), 1);
})
})