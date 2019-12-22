// Packages import

const express = require("express");
const router = express.Router();
const mailgun = require("mailgun-js");

// Mailgun process

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

// Model import

const ImmoProject = require("../Models/ImmoProject");

// ---|| ROUTE CREATE ||--- //

router.post("/immoProject/new", async (req, res) => {
  try {
    // We declare const newProject to be a creation based on our model ImmoProject
    // Each keys referenced will be the value received from the front-office, so user's choices

    const newProject = new ImmoProject({
      typeOfProperty: req.fields.typeOfProperty,
      stateOfProperty: req.fields.stateOfProperty,
      useOfProperty: req.fields.useOfProperty,
      userSituation: req.fields.userSituation,
      locationOfProperty: req.fields.locationOfProperty,
      amount: req.fields.amount,
      email: req.fields.email
    });

    // Saving in our dataBase
    await newProject.save();

    // Sending response to our front-office with all elements about the user demand
    res.json(newProject);

    // Sending an e-mail to the user email with every elements of his demand
    mg.messages().send(
      {
        from: "Mailgun Sandbox <postmaster@" + DOMAIN + ">",
        to: newProject.email,
        subject: "Meilleur Taux: accusé réception de votre formulaire",
        text:
          "Bonjour," +
          "\n" +
          "Nous accusons réception de votre demande de projet immobilier !" +
          "\n" +
          "Nous vous rappelons votre dossier: " +
          "réf: " +
          newProject._id +
          "\n" +
          "Type de bien: " +
          newProject.typeOfProperty +
          "\n" +
          "Etat du bien: " +
          newProject.stateOfProperty +
          "\n" +
          "Usage du bien: " +
          newProject.useOfProperty +
          "\n" +
          "Votre situation: " +
          newProject.userSituation +
          "\n" +
          "Localisation du bien: " +
          newProject.locationOfProperty +
          "\n" +
          "Montant estimé: " +
          newProject.amount.estimated +
          "\n" +
          "Montant des travaux: " +
          newProject.amount.works +
          "\n" +
          "Frais de notaire: " +
          newProject.amount.notarial +
          "\n" +
          "Total: " +
          newProject.amount.total +
          "\n" +
          "Email: " +
          newProject.email +
          "\n" +
          "\n" +
          "À bientôt" +
          "\n" +
          "L'équipe MeilleurTaux (from @LeReacteur)"
      },
      (error, body) => {
        console.log(body);
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---|| ROUTE READ ||--- //

// ***** 1- READ-ALL-IMMO-PROJECTS ***** //

// This route will be used in order to show all demands which are in dataBase

router.get("/immoProject/readAll", async (req, res) => {
  try {
    const readImmoProjects = await ImmoProject.find();
    res.json(readImmoProjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ***** 2- READ-ONE-IMMO-PROJECT ***** //

// This route will be used in order to show only one demand which are in dataBase
// We take the id put in the URL address and search by Id in our dataBase
// When Id is found --> Sending the demand from our dataBase to our front-office

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

// This route will be used in order to delete only one demand which are in dataBase
// We take the id put in the URL address and search by Id in our dataBase
// When Id is found --> Remove from our dataBase

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
