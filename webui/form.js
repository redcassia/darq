function _getImgInputData(input) {
  var name = input.children[0].attributes['name'] ? input.children[0].attributes['name'].value : null;
  var data = [];

  for (var child of input.parentNode.children) {
    if (child.classList[0] == 'img-upload-obj') {
      data.push(child.children[0].files[0]);
    }
  }

  if (input.attributes['required'] && data.length == 0) {
    alert(`${input.attributes['data-friendly-name'].value} cannot be left empty`);
    throw new Error("Form validation failed");
  }

  var res = {}
  res[name] = input.classList.contains('multiple') ? data : data[0];

  return res;
}

function _getMultiStringInputData(input) {
  var name = input.children[1].attributes['name'] ? input.children[1].attributes['name'].value : null;
  var data = [];

  for (var child of input.children[0].children) {
    if (child.classList[0] == 'string-obj') {
      data.push(child.attributes['data-string'].value);
    }
  }

  var inputVal = String(input.children[1].value);
  if (inputVal && inputVal.length > 0 && data.indexOf(inputVal) == -1) {
    data.push(inputVal);
  }

  if (input.attributes['required'] && data.length == 0) {
    alert(`${input.attributes['data-friendly-name'].value} cannot be left empty`);
    throw new Error("Form validation failed");
  }

  var res = {}
  res[name] = data;

  return res;
}

function _getMultiFormData(form) {
  var name = form.attributes['data-name'] ? form.attributes['data-name'].value : null;
  var data = [];

  for (var child of form.children) {
    if (child.classList[0] == 'sub-form') {
      data.push(_getFormData(child));
    }
  }

  if (form.attributes['required'] && data.length == 0) {
    alert(`${input.attributes['data-friendly-name'].value} cannot be left empty`);
    throw new Error("Form validation failed");
  }

  var res = {};
  res[name] = data;

  return res;
}

function _getInputData(input) {
  var name = input.attributes['name'] ? input.attributes['name'].value : null;
  var data;

  var type = input.type;
  switch (type) {
    case 'submit':
      return {};

    case 'checkbox':
      data = input.checked;
      break;

    default:
      if (input.attributes['data-special-type']) {
        type = input.attributes['data-special-type'].value;
        switch (type) {
          case 'float':
            data = parseFloat(input.value);
            break;

          case 'bool':
            data = input.value == "true";
            break;
  
          default: break;
        }
      }
      else {
        data = input.value;
      }
  }

  if (input.attributes['required'] && (!data || data.length == 0)) {
    alert(`${input.attributes['data-friendly-name'].value} cannot be left empty`);
    throw new Error("Form validation failed");
  }

  var res = {}
  res[name] = data;

  return res;
}

function _getFormData(form) {

  var data = { };

  for (var child of form.children) {
    if (child.classList[0] == 'form-line' || child.classList[0] == 'form-box') {
      data = { ...data, ..._getFormData(child) };
    }
    else {
      switch (child.tagName) {
        case 'DIV':
          switch (child.classList[0]) {
            case 'img-input':
              data = { ...data, ..._getImgInputData(child) };
              break;

            case 'select':
              data = { ...data, ..._getFormData(child) };
              break;

            case 'multistring-input':
              data = { ...data, ..._getMultiStringInputData(child) };
              break;

            case 'multiform':
              data = { ...data, ..._getMultiFormData(child) };
              break;

            case 'form-object':
              data[child.attributes['data-name'].value] = _getFormData(child);
              break;
  
            case 'form-array':
              data[child.attributes['data-name'].value] = [_getFormData(child)];
              break;

            default: break;
          }
          break;

        case 'SELECT':
        case 'INPUT':
        case 'TEXTAREA':
            data = { ...data, ..._getInputData(child) };
          break;

        default: break;   // ignore others
      }
    }
  }

  return data;
}

function getFormData(formId) {
  var data = _getFormData(document.getElementById(formId));
  console.log(data);
  return data;
}
