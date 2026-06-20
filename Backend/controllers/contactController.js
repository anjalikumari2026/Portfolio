const Contact = require("../models/ContactModel");

const ALLOWED_FIELDS = ["name", "email", "subject", "message"];

exports.createContact = async (req, res, next) => {
  try {
    const contactData = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        contactData[field] = req.body[field];
      }
    });

    const contact = await Contact.create(contactData);
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const { search, read } = req.query;
    const query = {};

    if (read === "true") query.read = true;
    else if (read === "false") query.read = false;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ read: false });

    res.status(200).json({ success: true, contacts, unreadCount });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { read } = req.body;
    const update = {};
    if (read !== undefined) update.read = read;
    else update.read = true;

    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Contact updated", contact });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};
