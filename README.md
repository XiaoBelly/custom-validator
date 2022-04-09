# custom-basic-validator.js

The library can also be installed through [npm][npm]

```bash
$ npm install --save-dev custom-basic-validator
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
  callback(new Error("Please enter address!"));
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
  age: [{ type: "number", message: "Age must be numeric" }],
  address: [{ validator: validatorAddress }],
};

var innerForm = new ValidatorForm(formData, formRule, false);

innerForm.validate(function (validate, fields) {
  console.info("validate ==>", validate, fields);
  // false
  // [
  //   { field: 'name', message: 'Name length cannot be between 1 and 5' },
  //   { field: 'age', message: 'Age must be numeric' },
  //   { field: 'address', message: 'Please enter address!' }
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
  name: [{ required: true, message: "Please enter name!" }],
  child: [{ validator: validatorChild }],
};

const formChildRule = {
  name: [{ required: true, message: "Please enter child name!" }],
  grand: [{ validator: validatorGrand }],
};

const formGrandRule = {
  name: [{ required: true, message: "Please enter grandson name!" }],
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
  //   { field: 'name', message: 'Please enter name!' },
  //   { field: 'child.name', message: 'Please enter child name!' },
  //   { field: 'child.grand.name', message: 'Please enter grandson name!' }
  // ]
});
```

### Advanced usage - array of nested objects

```javascript
const { ValidatorForm } = require("../index");

const formData = {
  name: "",
  child: [
    {
      childName: "",
    },
  ],
};

const formRule = {
  name: [{ required: true, message: "Please enter name!" }],
  child: [{ validator: validatorChild }],
};

const formChildRule = {
  childName: [{ required: true, message: "Please enter child name!" }],
};

function validatorChild(value, callback) {
  let result = [];
  for (const item of value) {
    const innerForm = new ValidatorForm(item, formChildRule, false);
    innerForm.validate(function (validate, fields) {
      if (!validate) {
        result = result.concat(fields);
      }
    });
  }

  if (result.length) {
    callback(result);
  } else {
    callback();
  }
}

const innerForm = new ValidatorForm(formData, formRule, false);

innerForm.validate(function (validate, fields) {
  console.info("validate ==>", validate, fields);
  // false
  // [
  //   { field: 'name', message: 'Please enter name!' },
  //   { field: 'child.grand.name', message: 'Please enter child name!' }
  // ]
});
```

## Validator

| Validator                             | Description                                                                                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ValidatorForm(data, rule, status)** | Check if the form data is correct.<br /><br />`data` is an object. check the form object<br /><br />`rule` is an object. check form object validation rules<br /><br />`status` comparison all the data and return the result, default `false`. |

### ValidatorForm Methods

| Method                 | Description                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **validate(callback)** | Check if the form data is correct.<br /><br />`callback` is an function that defaults return to (validator, fields)<br />Callback: <br/>`validator`: validation results, default `true`.<br/>`fields`: validation exception field array, default `[]`. |

### ValidatorForm Rule Attributes

| Method                         | Description                                                                                                                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **message**                    | Check form data error message. default `""`                                                                                                                                                               |
| **required**                   | Check if the form data is empty. default `false`                                                                                                                                                          |
| **type**                       | Check the form data type. default `string`<br />data type is one of `['number','string', 'array', 'date']`.                                                                                               |
| **max**                        | Check the form data max length.                                                                                                                                                                                  |
| **min**                        | Check the form data min length.                                                                                                                                                                                  |
| **minimum**                        | Check the form data minimum.                                                                                                                                                                                  |
| **maximum**                        | Check the form data maximum.                                                                                                                                                                                  |
| **validator(value, callback)** | Check the form data custom validator function. <br />`value`: Check form data.<br />`callback`: Callback function must be executed.<br />Example: `callback()` or `callback(new Error("Error message"))`. |

[npm]: https://nodejs.org/en/
