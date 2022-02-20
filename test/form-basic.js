const { ValidatorForm } = require("../index");

function validatorAddress(value, callback) {
  callback(new Error("请输入地址"));
}

var formData = {
  name: "test name",
  age: "",
  address: "",
};

var formRule = {
  name: [
    { required: true, message: "请输入名称" },
    { min: 1, max: 5, message: "名字长度不能大于5位" },
  ],
  age: [{ type: "number", message: "年龄必须数字类型" }],
  address: [{ validator: validatorAddress }],
};

var innerForm = new ValidatorForm(formData, formRule, false);

innerForm.validate(function (validate, fields) {
  console.info("validate ==>", validate, fields);
});
