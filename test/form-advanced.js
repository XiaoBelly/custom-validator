const { ValidatorForm } = require("../src/index");

const formData = {
  name: "",
  child: {
    name: "",
    grand: {
      name: ""
    }
  },
};

const formRule = {
  name: [{ required: true, message: "Please enter name!" }],
  child: [{ validator: validatorChild }],
};

const formChildRule = {
  name: [{ required: true, message: "Please enter child name!" }],
  grand: [{ validator: validatorGrand }]
};

const formGrandRule = {
  name: [{ required: true, message: "Please enter grandson name!" }]
};

function validatorChild(value, callback) {
  const innerForm = new ValidatorForm(formData.child, formChildRule, false);
  innerForm.validate(function (validate, fields) {
    if (validate) {
      callback();
    } else {
      callback(fields);
    }
  });
}


function validatorGrand(value, callback) {
  const innerForm = new ValidatorForm(formData.child.grand, formGrandRule, false);
  innerForm.validate(function (validate, fields) {
    if (validate) {
      callback();
    } else {
      callback(fields);
    }
  });
}

const innerForm = new ValidatorForm(formData, formRule, false);

innerForm.validate(function (validate, fields) {
  console.info("validate ==>", validate, fields);
});
