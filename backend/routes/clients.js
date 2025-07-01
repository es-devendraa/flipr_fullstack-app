const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a client
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 450,
      height: 350,
      crop: 'fill',
    });
    const client = new Client({
      image: result.secure_url,
      name: req.body.name,
      description: req.body.description,
      designation: req.body.designation,
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit a client
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, designation } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { width: 450, height: 350, crop: 'fill' });
      client.image = result.secure_url;
    }
    client.name = name || client.name;
    client.description = description || client.description;
    client.designation = designation || client.designation;
    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;