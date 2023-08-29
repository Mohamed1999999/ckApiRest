require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Utilisateur = require("./models/Utilisateur");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    app.get("/utilisateurs", async (req, res) => {
      try {
        const utilisateurs = await Utilisateur.find();
        res.json(utilisateurs);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/utilisateurs", async (req, res) => {
      try {
        const nouvelUtilisateur = new Utilisateur(req.body);
        const savedUser = await nouvelUtilisateur.save();
        res.status(201).json(savedUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    app.put("/utilisateurs/:id", async (req, res) => {
      try {
        const utilisateur = await Utilisateur.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        res.json(utilisateur);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    app.delete("/utilisateurs/:id", async (req, res) => {
      try {
        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé avec succès", utilisateur });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
