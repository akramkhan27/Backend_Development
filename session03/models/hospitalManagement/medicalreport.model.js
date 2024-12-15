import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({}, { timestamps: true });

export const MedicalReport = mongoose.model(
  "MedicalReport",
  medicalReportSchema
);
