const createOne = (Model) => async (req, res) => {
  try {
    const document = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAll = (Model, populateOptions = []) => async (req, res) => {
  try {
    const filter = { ...req.query };

    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((field) => delete filter[field]);

    let query = Model.find(filter);

    populateOptions.forEach((option) => {
      query = query.populate(option);
    });

    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    const documents = await query;

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOne = (Model, populateOptions = []) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);

    populateOptions.forEach((option) => {
      query = query.populate(option);
    });

    const document = await query;

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateOne = (Model) => async (req, res) => {
  try {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteOne = (Model) => async (req, res) => {
  try {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    res.json({
      success: true,
      message: "Document deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
};
