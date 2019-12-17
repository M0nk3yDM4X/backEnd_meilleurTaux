// Packages import

const express = require("express");
const router = express.Router();

// Model import

const ImmoProject = require("../Models/ImmoProject");

// ---|| ROUTE CREATE ||--- //

router.post("/immoProject/new", async (req, res) => {
  try {
    const newProject = new ImmoProject({
      typeOfProperty: req.fields.typeOfProperty,
      stateOfProperty: req.fields.stateOfProperty,
      useOfProperty: req.fields.useOfProperty,
      userSituation: req.fields.userSituation,
      locationOfProperty: req.fields.location,
      amount: req.fields.amount
    });
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---|| ROUTE READ ||--- //

// ***** 1- READ-ALL-IMMO-PROJECTS ***** //

router.get("/immoProject/readAll", async (req, res) => {
  try {
    const readImmoProjects = await ImmoProject.find();
    res.json(readImmoProjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ***** 2- READ-ONE-IMMO-PROJECT ***** //

router.get("/immoProject/readOne/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const readOneProject = await ImmoProject.findById(id);

    if (readOneProject) {
      res.json(readOneProject);
    } else {
      res.status(404).json({ message: "immoProject not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---|| ROUTE UPDATE ||--- //

// ---|| ROUTE DELETE ||--- //

router.post("/immoProject/deleteOne/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const idToDelete = await ImmoProject.findById(id);

    if (idToDelete) {
      await idToDelete.remove();
      res.json({ success: "immoProject deleted" });
    } else {
      res.status(404).json({ message: "immoProject not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
