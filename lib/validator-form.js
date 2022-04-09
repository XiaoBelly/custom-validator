"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

// 非空校验
var emptyReg = /^\s*|\s*$/g; // 获取数据类型

function getDataType(data) {
  return Object.prototype.toString.call(data);
} // 空数据类型校验


function nonEmptyPrimaryTypeValidation(value) {
  var emptyDataTypes = ["[object Undefined]", "[object Null]"];
  return !emptyDataTypes.includes(getDataType(value));
} // 空空格校验


function nonEmptySpaceValidation(value) {
  var length = String(value).replace(emptyReg, "");
  return Boolean(length);
}

var _validateResult = /*#__PURE__*/new WeakMap();

var ValidatorForm = /*#__PURE__*/function () {
  function ValidatorForm(data, rules, validateSingle) {
    _classCallCheck(this, ValidatorForm);

    _classPrivateFieldInitSpec(this, _validateResult, {
      writable: true,
      value: {
        status: true,
        // 校验状态
        fields: [// {
          //   field: "", // 校验字段
          //   message: "" // 校验异常错误提示内容
          // }
        ]
      }
    });

    this.data = data; // 表单数据

    this.rules = rules; // 表单校验规则

    this.validateSingle = validateSingle; // 是否验证单个; false: 则验证所有数据并返回验证结果

    this.validateResult = {};
  }

  _createClass(ValidatorForm, [{
    key: "validateResult",
    get: function get() {
      return _classPrivateFieldGet(this, _validateResult);
    },
    set: function set(data) {
      _classPrivateFieldSet(this, _validateResult, data);
    }
  }, {
    key: "validate",
    value: function validate(callback) {
      var result = this.validateResult = {
        status: true,
        fields: []
      };

      try {
        var data = this.data,
            rules = this.rules;

        if (getDataType(data) !== "[object Object]") {
          throw "The validation data type must be Object";
        }

        if (getDataType(rules) !== "[object Object]") {
          throw "The validation data rule must be Object";
        }

        var traverseData = ValidatorForm.traverseData.bind(this);
        result = traverseData(data);
      } catch (error) {
        result.status = false;
      }

      typeof callback === "function" && callback(result.status, result.fields);
      return result;
    } // 遍历数据

  }], [{
    key: "traverseData",
    value: function traverseData(data) {
      var traverseRule = ValidatorForm.traverseRule.bind(this);

      for (var field in data) {
        var rules = this.rules[field];
        traverseRule(field, data[field], rules);

        if (!this.validateResult.status && this.validateSingle) {
          break;
        }
      }

      return this.validateResult;
    } // 遍历校验规则

  }, {
    key: "traverseRule",
    value: function traverseRule(field, value, rules) {
      var validateRule = ValidatorForm.validateRule.bind(this);

      if (getDataType(rules) === "[object Array]") {
        var _iterator = _createForOfIteratorHelper(rules),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rule = _step.value;
            var result = validateRule(value, rule);

            if (!result.status) {
              var _rule$message = rule.message,
                  message = _rule$message === void 0 ? "" : _rule$message;
              var fields = this.validateResult.fields;

              if (Array.isArray(result.fields) && result.fields.length) {
                var _iterator2 = _createForOfIteratorHelper(result.fields),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var item = _step2.value;
                    item.field = "".concat(field, ".").concat(item.field);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                fields = fields.concat(result.fields);
              } else {
                fields.push({
                  field: field,
                  message: result.message || message
                });
              }

              this.validateResult.fields = fields;
              this.validateResult.status = false;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "validateRule",
    value: function validateRule(value, rule) {
      var customValidate = new CustomValidate(value, rule);
      customValidate.value = value;
      customValidate.rule = rule;
      return customValidate.validate();
    }
  }]);

  return ValidatorForm;
}();

var CustomValidate = /*#__PURE__*/function () {
  function CustomValidate(value, rule) {
    _classCallCheck(this, CustomValidate);

    this.value = value; // 校验内容

    this.rule = rule; // 校验规则
    // 校验结果

    this.result = {
      status: true,
      // 校验状态
      message: "",
      // 错误提示
      fields: [] // 错误字段和提示

    };

    if (!CustomValidate.singleton) {
      CustomValidate.singleton = this;
    }

    return CustomValidate.singleton;
  }

  _createClass(CustomValidate, [{
    key: "validate",
    value: function validate() {
      this.result = {
        status: true,
        message: "",
        fields: []
      };
      var nonEmptyPrimaryType = nonEmptyPrimaryTypeValidation(this.value);
      var nonEmptySpace = nonEmptySpaceValidation(this.value);

      try {
        // validator 优先级高于所有校验规则
        if (this.rule.validator instanceof Function) {
          this.rule.validator(this.value, this.validator.bind(this));
        } else {
          if (nonEmptyPrimaryType && nonEmptySpace) {
            var validateTypes = ["type", "min", "max", "minimum", "maximum"];

            for (var _i = 0, _validateTypes = validateTypes; _i < _validateTypes.length; _i++) {
              var type = _validateTypes[_i];

              if (type in this.rule) {
                var validatorValue = this.rule[type];
                this.result.status = this["".concat(type, "Validator")](validatorValue);

                if (!this.result.status) {
                  break;
                }
              }
            }
          } else {
            this.result.status = this.rule.required ? false : true;
          }
        }
      } catch (error) {
        Object.assign(this.result, {
          status: false,
          message: error.message
        });
      }

      return this.result;
    }
  }, {
    key: "required",
    value: function required() {
      return nonEmptyPrimaryTypeValidation(this.value) || nonEmptySpaceValidation(this.value);
    }
  }, {
    key: "typeValidator",
    value: function typeValidator(rule) {
      var status = true; // 浮点数 /^(-?\d+)(\.\d+)?$/.test("-1.2")

      var primaryType = rule.replace(/^\w/, function (value) {
        return value.toUpperCase();
      }); // 待换成链判断运算符写法

      var typeValidator = CustomValidate["Type".concat(primaryType, "Validator")];

      if (typeof typeValidator !== "function") {
        // 默认为 String
        typeValidator = CustomValidate.TypeStringValidator;
      }

      status = typeValidator(this.value);
      return status;
    }
  }, {
    key: "minValidator",
    value: function minValidator(rule) {
      if (this.required()) {
        return String(this.value).length >= rule;
      }

      return true;
    }
  }, {
    key: "maxValidator",
    value: function maxValidator(rule) {
      if (this.required()) {
        return String(this.value).length <= rule;
      }

      return true;
    }
  }, {
    key: "minimumValidator",
    value: function minimumValidator(rule) {
      if (this.required()) {
        return Number(this.value) >= rule;
      }

      return true;
    }
  }, {
    key: "maximumValidator",
    value: function maximumValidator(rule) {
      if (this.required()) {
        return Number(this.value) <= rule;
      }

      return true;
    } // 自定义校验规则 validator - 优先级高于 type, min, max

  }, {
    key: "validator",
    value: function validator(error) {
      this.result = {
        status: true,
        message: "",
        fields: []
      };

      if (getDataType(error) === "[object Error]") {
        this.result = {
          status: false,
          message: error.message
        };
      } else if (getDataType(error) === "[object Array]") {
        Object.assign(this.result, {
          status: false,
          fields: error
        });
      }
    } // 自定义事件校验规则 validate-trigger

  }], [{
    key: "TypeStringValidator",
    value: function TypeStringValidator(value) {
      return getDataType(value) === "[object String]";
    }
  }, {
    key: "TypeNumberValidator",
    value: function TypeNumberValidator(value) {
      return getDataType(value) === "[object Number]" || /^[-]?\d|(\.\d+)+$/.test(value);
    }
  }, {
    key: "TypeArrayValidator",
    value: function TypeArrayValidator(value) {
      return getDataType(value) === "[object Array]";
    }
  }, {
    key: "TypeDateValidator",
    value: function TypeDateValidator(value) {
      return getDataType(value) === "[object Date]";
    }
  }]);

  return CustomValidate;
}();

module.exports = ValidatorForm;