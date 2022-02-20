const { ValidatorForm } = require("../index");

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
  name: [{ required: true, message: "请输入父级节点名称" }],
  child: [{ validator: validatorChild }],
};

const formChildRule = {
  name: [{ required: true, message: "请输入子级节点名称" }],
  grand: [{ validator: validatorGrand }]
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

const formGrandRule = {
  name: [{ required: true, message: "请输入子孙级节点名称" }]
};

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
