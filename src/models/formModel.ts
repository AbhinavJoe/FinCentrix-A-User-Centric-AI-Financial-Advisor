// import mongoose from 'mongoose';

// const formSchema = new mongoose.Schema({
//   age: Number,
//   employmentStatus: String,
//   annualIncome: Number,
//   financialGoals: String,
//   riskTolerance: Number,
//   existingDebts: String,
//   monthlyBudget: Number,
//   insuranceTypes: String,
//   retirementAge: Number,
// });

// const Form = mongoose.models.Form || mongoose.model('Form', formSchema);

// export default Form;


import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Link form data to username
  age: Number,
  employmentStatus: String,
  annualIncome: Number,
  financialGoals: String,
  riskTolerance: Number,
  existingDebts: String,
  monthlyBudget: Number,
  insuranceTypes: String,
  retirementAge: Number,
});

const Form = mongoose.models.Form || mongoose.model('Form', formSchema);

export default Form;
