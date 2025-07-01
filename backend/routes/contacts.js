const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.none(), async (req, res) => {
  const { fullName, email, mobileNumber, city } = req.body;
  const contact = new Contact({ fullName, email, mobileNumber, city });
  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.none(), async (req, res) => {
  const { fullName, email, mobileNumber, city } = req.body;
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.fullName = fullName || contact.fullName;
    contact.email = email || contact.email;
    contact.mobileNumber = mobileNumber || contact.mobileNumber;
    contact.city = city || contact.city;
    const updated = await contact.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
