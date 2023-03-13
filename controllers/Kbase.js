const Kbase = require("../models/kbase");

/**
 * @desc    Create Knowledgebase
 * @route   POST /knowledgebase/post
 * @access  Public
 */
const createKbase = async (req, res, next) => {
  const { name, email, title, content, department, image } = req.body;
  if (!name || !email || !title || !content) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const createdAt = new Date();
    const result = await Kbase.create({
      name,
      email,
      department,
      title,
      content,
      status: "pending",
      image,
      createdAt,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * @desc    View Kbase
 * @route   GET /Knowledgebase/pending
 * @access  Public
 */
const viewPending = async (req, res) => {
  try {
    const kbase = await Kbase.find({ status: "pending" }).exec();
    if (kbase.length === 0) {
      return res.status(204).json({ message: "No knowledgebase found" });
    }
    res.json(kbase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    View Kbase
 * @route   GET /Kbase/:KbaseID
 * @access  Public
 */

const viewKbase = async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Post title required." });
    }

    const kbase = await Kbase.findOne({ title }).exec();

    if (!kbase) {
      return res
        .status(404)
        .json({ message: `No Kbase matches title "${title}".` });
    }

    res.json({ kbase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    View All Knowledgebase
 * @route   GET /knowledgebase
 * @access  Public
 */
const getAllKbase = async (req, res) => {
  try {
    const kbase = await Kbase.find();

    if (kbase.length === 0) {
      return res.status(404).json({ message: "No knowledgebase found" });
    }

    res.json(kbase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createKbase,
  getAllKbase,
  viewKbase,
  viewPending,
};
