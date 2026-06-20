const Project = require("../models/ProjectModel");
const cloudinary = require("cloudinary").v2;

const ALLOWED_FIELDS = [
  "title",
  "description",
  "technologies",
  "githubLink",
  "liveLink",
  "featured",
  "category",
  "order",
  "status",
];

const uploadToCloudinary = (buffer, mimetype) => {
  return cloudinary.uploader.upload(
    `data:${mimetype};base64,${buffer.toString("base64")}`,
    { folder: "portfolio/projects" }
  );
};

exports.createProject = async (req, res, next) => {
  try {
    const projectData = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "technologies") {
          try {
            projectData[field] = JSON.parse(req.body[field]);
          } catch {
            projectData[field] = req.body[field]
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
          }
        } else if (field === "featured") {
          projectData[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (field === "order") {
          projectData[field] = Number(req.body[field]) || 0;
        } else {
          projectData[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      projectData.image = result.secure_url;
      projectData.imagePublicId = result.public_id;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "technologies") {
          try {
            updateData[field] = JSON.parse(req.body[field]);
          } catch {
            updateData[field] = req.body[field]
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
          }
        } else if (field === "featured") {
          updateData[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (field === "order") {
          updateData[field] = Number(req.body[field]) || 0;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      if (existing.imagePublicId) {
        await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
      }
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
