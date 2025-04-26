import mongoose from "mongoose";
import { Student } from "../models/student.model.js"; // adjust path if needed
import xlsx from "xlsx";
import path from "path";

const classes = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const sections = ["A", "B", "C", "D"];
const session = "2024-25";

// Function to generate a roll number
const generateRollNo = (className, section, index) => {
  return `${className}-${section}-${index + 1}`;
};

// Function to read data from an Excel file
const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON
};

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://arpdevproductions:RsL263pntwVPsjnk@ncrc-website.mxex5wq.mongodb.net/NCRC-WEBSITE");

    // Clear previous data (optional)
    // await Student.deleteMany({});
    // console.log("✅ Previous student data cleared.");

    // Path to the Excel file (same directory as this script)
    const excelFilePath = path.resolve(process.cwd(), "students.xlsx"); // Replace with your Excel file name

    // Read data from the Excel file
    const studentsData = readExcelFile(excelFilePath);

    // Transform data to match the Student schema
    const students = studentsData.map((data, index) => ({
      studentId: data.studentId || `NCR-${(index + 1000).toString()}`, // Use studentId from Excel or generate one
      name: data.name || `Student ${index + 1}`,
      fatherName: data.fatherName || `Father ${index + 1}`,
      motherName: data.motherName || `Mother ${index + 1}`,
      srNo: data.srNo || `SR-${index + 1}`,
      session: data.session || "2024-25",
      class: data.class || "1",
      section: data.section || "A",
      dob: data.dob ? new Date(data.dob) : new Date(2005, 5, 15), // Parse DOB if provided
      gender: data.gender || (index % 2 === 0 ? "Male" : "Female"),
      address: data.address || `Address ${index + 1}`,
      mobileNo: data.mobileNo || `98${(Math.random() * 100000000).toFixed(0)}`,
      photo: data.photo || "",
      transferCertificate: data.transferCertificate || "",
      admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
    }));

    // Insert data into the Student collection
    await Student.insertMany(students);
    console.log(`✅ ${students.length} Students Seeded`);

    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding students:", error.message);
    mongoose.disconnect();
  }
};

seed();
