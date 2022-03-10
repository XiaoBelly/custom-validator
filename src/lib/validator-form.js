// 非空校验
const emptyReg = /^\s*|\s*$/g;
// 获取数据类型
function getDataType(data) {
  return Object.prototype.toString.call(data);
}
// 空数据类型校验
function nonEmptyPrimaryTypeValidation(value) {
  const emptyDataTypes = ["[object Undefined]", "[object Null]"];
  return !emptyDataTypes.includes(getDataType(value));
}
// 空空格校验
function nonEmptySpaceValidation(value) {
  const length = String(value).replace(emptyReg, "");
  return Boolean(length);
}

class ValidatorForm {
  #validateResult = {
    status: true, // 校验状态
    fields: [
      // {
      //   field: "", // 校验字段
      //   message: "" // 校验异常错误提示内容
      // }
    ],
  };
  constructor(data, rules, validateSingle) {
    this.data = data; // 表单数据
    this.rules = rules; // 表单校验规则
    this.validateSingle = validateSingle; // 是否验证单个; false: 则验证所有数据并返回验证结果
    this.validateResult = {};
  }
  get validateResult() {
    return this.#validateResult;
  }
  set validateResult(data) {
    this.#validateResult = data;
  }
  validate(callback) {
    let result = (this.validateResult = {
      status: true,
      fields: [],
    });
    try {
      const { data, rules } = this;
      if (getDataType(data) !== "[object Object]") {
        throw "The validation data type must be Object";
      }
      if (getDataType(rules) !== "[object Object]") {
        throw "The validation data rule must be Object";
      }
      const traverseData = ValidatorForm.traverseData.bind(this);
      result = traverseData(data);
    } catch (error) {
      result.status = false;
    }
    typeof callback === "function" && callback(result.status, result.fields);
    return result;
  }
  // 遍历数据
  static traverseData(data) {
    const traverseRule = ValidatorForm.traverseRule.bind(this);
    for (let field in data) {
      const rules = this.rules[field];
      traverseRule(field, data[field], rules);
      if ((!this.validateResult.status && this.validateSingle)) {
        break;
      }
    }
    return this.validateResult;
  }
  // 遍历校验规则
  static traverseRule(field, value, rules) {
    const validateRule = ValidatorForm.validateRule.bind(this);
    if (getDataType(rules) === "[object Array]") {
      for (let rule of rules) {
        const result = validateRule(value, rule);
        if (!result.status) {
          const { message = "" } = rule;
          let fields = this.validateResult.fields;
          if (Array.isArray(result.fields) && result.fields.length) {
            for (const item of result.fields) {
              item.field = `${field}.${item.field}`;
            }
            fields = fields.concat(result.fields);
          } else {
            fields.push({
              field,
              message: result.message || message,
            });
          }
          this.validateResult.fields = fields;
          this.validateResult.status = false;
          break;
        }
      }
    }
  }
  static validateRule(value, rule) {
    const customValidate = new CustomValidate(value, rule);
    customValidate.value = value;
    customValidate.rule = rule;
    return customValidate.validate();
  }
}

class CustomValidate {
  constructor(value, rule) {
    this.value = value; // 校验内容
    this.rule = rule; // 校验规则
    // 校验结果
    this.result = {
      status: true, // 校验状态
      message: "", // 错误提示
      fields: [], // 错误字段和提示
    };

    if (!CustomValidate.singleton) {
      CustomValidate.singleton = this;
    }

    return CustomValidate.singleton;
  }
  validate() {
    this.result = {
      status: true,
      message: "",
      fields: [],
    };
    const nonEmptyPrimaryType = nonEmptyPrimaryTypeValidation(this.value);
    const nonEmptySpace = nonEmptySpaceValidation(this.value);

    try {
      // validator 优先级高于所有校验规则
      if (this.rule.validator instanceof Function) {
        this.rule.validator(this.value, this.validator.bind(this));
      } else {
        if (nonEmptyPrimaryType) {
          if (nonEmptySpace) {
            const validateTypes = ["type", "min", "max"];

            for (const type of validateTypes) {
              if (type in this.rule) {
                const validatorValue = this.rule[type];
                this.result.status = this[`${type}Validator`](validatorValue);
                if (!this.result.status) {
                  break;
                }
              }
            }
          } else {
            this.result.status = false;
          }
        } else {
          this.result.status = this.rule.required ? false : true;
        }
      }
    } catch (error) {
      Object.assign(this.result, {
        status: false,
        message: error.message,
      });
    }
    return this.result;
  }
  required() {
    return (
      nonEmptyPrimaryTypeValidation(this.value) ||
      nonEmptySpaceValidation(this.value)
    );
  }
  typeValidator(rule) {
    let status = true;
    // 浮点数 /^(-?\d+)(\.\d+)?$/.test("-1.2")
    const primaryType = rule.replace(/^\w/, function (value) {
      return value.toUpperCase();
    });

    // 待换成链判断运算符写法
    let typeValidator = CustomValidate[`Type${primaryType}Validator`];

    if (typeof typeValidator !== "function") {
      // 默认为 String
      typeValidator = CustomValidate.TypeStringValidator;
    }

    status = typeValidator(this.value);
    return status;
  }
  minValidator(rule) {
    return this.required() && String(this.value).length >= rule;
  }
  maxValidator(rule) {
    return this.required() && String(this.value).length <= rule;
  }
  // 自定义校验规则 validator - 优先级高于 type, min, max
  validator(error) {
    this.result = {
      status: true,
      message: "",
      fields: [],
    };
    if (getDataType(error) === "[object Error]") {
      this.result = {
        status: false,
        message: error.message,
      };
    } else if (getDataType(error) === "[object Array]") {
      Object.assign(this.result, {
        status: false,
        fields: error,
      });
    }
  }
  // 自定义事件校验规则 validate-trigger
  static TypeStringValidator(value) {
    return getDataType(value) === "[object String]";
  }
  static TypeNumberValidator(value) {
    return getDataType(value) === "[object Number]" || /^[-]?\d|(\.\d+)+$/.test(value);
  }
  static TypeArrayValidator(value) {
    return getDataType(value) === "[object Array]";
  }
  static TypeDateValidator(value) {
    return getDataType(value) === "[object Date]";
  }
}

module.exports = ValidatorForm;
