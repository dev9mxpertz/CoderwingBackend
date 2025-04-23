const JobApplication = require("../models/inqury-model");
const Application = require("../models/Application"); 


const applyJob = async (req, res) => {
  try {
    const { name, email, contactNumber, interest, education, remark } = req.body;
    const cvPath = req.file ? `uploads/${req.file.filename}`: null;

    const newApplication = new JobApplication({
      name,
      email,
      contactNumber,
      interest,
      education,
      remark,
      cv: cvPath,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const getMonthlyApplications = async (req, res) => {
  try {
      const applications = await JobApplication.aggregate([
          {
              $group: {
                  _id: { $month: "$createdAt" },
                  count: { $sum: 1 }
              }
          },
          { $sort: { _id: 1 } }
      ]);

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedData = applications.map(item => ({
          month: months[item._id - 1],
          count: item.count
      }));

      res.status(200).json(formattedData);
  } catch (error) {
      console.error("Error in getMonthlyApplications:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};




module.exports = { applyJob, getAllApplications, getMonthlyApplications };
