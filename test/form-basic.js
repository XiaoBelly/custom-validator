const { ValidatorForm } = require("../index");

function validatorAddress(value, callback) {
  callback(new Error("Please enter address"));
}

var formData = {
  name: "test name",
  age: "",
  address: "",
};

var formRule = {
  name: [
    { required: true, message: "Please enter name!" },
    { min: 1, max: 5, message: "Name length cannot be between 1 and 5" },
  ],
  age: [{ type: "number", message: "Age must be numeric!" }],
  address: [{ validator: validatorAddress }],
};

var innerForm = new ValidatorForm(formData, formRule, false);

innerForm.validate(function (validate, fields) {
  console.info("validate ==>", validate, fields);
});
