const Certificate = require("../models/CertificateModel");
const cloudinary = require("cloudinary").v2;

const ALLOWED_FIELDS = [
  "title", "issuer", "issueDate", "credentialId", "verifyLink", "order",
];

const uploadToCloudinary = (buffer, mimetype, folder) => {
  return cloudinary.uploader.upload(
    `data:${mimetype};base64,${buffer.toString("base64")}`,
    { folder, resource_type: mimetype === "application/pdf" ? "raw" : "image" }
  );
};

exports.createCertificate = async (req, res, next) => {
  try {
    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        "portfolio/certificates"
      );
      data.certificateFile = result.secure_url;
      data.certificatePublicId = result.public_id;
    }

    const certificate = await Certificate.create(data);
    res.status(201).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

exports.getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, issueDate: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    next(error);
  }
};

exports.getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

exports.updateCertificate = async (req, res, next) => {
  try {
    const existing = await Certificate.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    if (req.file) {
      if (existing.certificatePublicId) {
        const resourceType = existing.certificateFile?.includes(".pdf") ? "raw" : "image";
        await cloudinary.uploader.destroy(existing.certificatePublicId, { resource_type: resourceType }).catch(() => {});
      }
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        "portfolio/certificates"
      );
      data.certificateFile = result.secure_url;
      data.certificatePublicId = result.public_id;
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, data, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, message: "Certificate updated successfully", certificate });
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    if (certificate.certificatePublicId) {
      const resourceType = certificate.certificateFile?.includes(".pdf") ? "raw" : "image";
      await cloudinary.uploader.destroy(certificate.certificatePublicId, { resource_type: resourceType }).catch(() => {});
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    next(error);
  }
};
