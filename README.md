# custom-basic-validator.js

The library can also be installed through [npm][npm]

```bash
$ npm i custom-basic-validator -D
```

#### No ES6

```javascript
var validator = require("custom-basic-validator");
var ValidatorForm = Validator.ValidatorForm; // => [class ValidatorForm]
```

### ES6

```javascript
import { ValidatorForm } from "custom-basic-validator";
```

Or, import only a subset of the library:

```javascript
import ValidatorForm from "custom-basic-validator/lib/validator-form";
```

### Basic usage

```javascript
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
  // false
  // [
  //   { field: 'name', message: '名字长度不能大于5位' },
  //   { field: 'age', message: '年龄必须数字类型' },
  //   { field: 'address', message: '请输入地址' }
  // ]
});
```

### Advanced usage

```javascript
const { ValidatorForm } = require("../index");

const formData = {
  name: "",
  child: {
    name: "",
    grand: {
      name: "",
    },
  },
};

const formRule = {
  name: [{ required: true, message: "请输入父级节点名称" }],
  child: [{ validator: validatorChild }],
};

const formChildRule = {
  name: [{ required: true, message: "请输入子级节点名称" }],
  grand: [{ validator: validatorGrand }],
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
  name: [{ required: true, message: "请输入子孙级节点名称" }],
};

function validatorGrand(value, callback) {
  const innerForm = new ValidatorForm(
    formData.child.grand,
    formGrandRule,
    false
  );
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
  // false
  // [
  //   { field: 'name', message: '请输入父级节点名称' },
  //   { field: 'child.name', message: '请输入子级节点名称' },
  //   { field: 'child.grand.name', message: '请输入子孙级节点名称' }
  // ]
});
```

## Validator

Validator                               | Description
--------------------------------------- | --------------------------------------
**ValidatorForm(data, rule, status)** | Check if the form data is correct.<br /><br />`data` is an object. check the form object<br /><br />`rule` is an object. check form object validation rules<br /><br />`status` comparison all the data and return the result, default `false`.

### ValidatorForm Methods
Method                               | Description
--------------------------------------- | --------------------------------------
**validate(callback)** | Check if the form data is correct.<br /><br />`callback` is an function that defaults return to (validator, fields)<br />Callback: <br/>`validator`: validation results, default `true`.<br/>`fields`: validation exception field array, default `[]`.


### ValidatorForm Rule Attributes
Method                               | Description
--------------------------------------- | --------------------------------------
**message** | Check form data error message. default `""`
**required** | Check if the form data is empty. default `false`
**type** | Check the form data type. default `string`<br />data type is one of `['number','string', 'array', 'date']`.
**max** | Check the form data max.
**min** | Check the form data min.
**validator(value, callback)** |  Check the form data custom validator function. <br />`value`: Check form data.<br />`callback`: Callback function must be executed.<br />Example: `callback()` or `callback(new Error("Error message"))`.

[npm]: https://nodejs.org/en/