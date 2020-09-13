class Form {

  // get //////////////////////////////////////////////////////////////////////

  static _getImgInputData(input) {
    var name = input.children[0].attributes['name'] ? input.children[0].attributes['name'].value : null;
    var data = [];

    for (var child of input.parentNode.children) {
      if (child.classList[0] == 'img-upload-obj') {
        var first = child.children[0];
        if (first) {
          if (first.files) {
            data.push(first.files[0]);
          }
          else if (first.attributes['data-val']) {
            data.push(first.attributes['data-val'].value);
          }
        }
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

  static _getMultiStringInputData(input) {
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

  static _getMultiFormData(form) {
    var name = form.attributes['data-name'] ? form.attributes['data-name'].value : null;
    var data = [];

    for (var child of form.children) {
      if (child.classList[0] == 'sub-form') {
        data.push(this._getFormData(child));
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

  static _getInputData(input) {
    var name = input.attributes['name'] ? input.attributes['name'].value : null;
    var data;

    var type = input.type;
    switch (type) {
      case 'submit':
        return {};

      case 'checkbox':
        data = input.checked;
        break;

      case 'datetime-local':
        data = input.value.replace('T', ' ');
        break;

      default:
        if (input.attributes['data-special-type']) {
          type = input.attributes['data-special-type'].value;
          switch (type) {
            case 'float':
              data = input.value ? parseFloat(input.value) : null;
              break;

            case 'bool':
              data = input.value == "true";
              break;

            default: break;
          }
        }
        else {
          data = (input.value && input.value.length > 0) ? input.value : null;
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

  static _getFormData(form) {

    var data = { };

    for (var child of form.children) {
      if (child.classList[0] == 'form-line' || child.classList[0] == 'form-box') {
        data = { ...data, ...this._getFormData(child) };
      }
      else {
        switch (child.tagName) {
          case 'DIV':
            switch (child.classList[0]) {
              case 'img-input':
                data = { ...data, ...this._getImgInputData(child) };
                break;

              case 'select':
                data = { ...data, ...this._getFormData(child) };
                break;

              case 'multistring-input':
                data = { ...data, ...this._getMultiStringInputData(child) };
                break;

              case 'multiform':
                data = { ...data, ...this._getMultiFormData(child) };
                break;

              case 'form-object': {
                var obj = this._getFormData(child);
                var allNull = true;
                for (var key in obj) {
                  if (obj[key] != null) {
                    allNull = false;
                    break;
                  }
                }
                data[child.attributes['data-name'].value] = allNull ? null : obj;
              }
              break;

              case 'form-array':
                data[child.attributes['data-name'].value] = [this._getFormData(child)];
                break;

              default: break;
            }
            break;

          case 'SELECT':
          case 'INPUT':
          case 'TEXTAREA':
              data = { ...data, ...this._getInputData(child) };
            break;

          default: break;   // ignore others
        }
      }
    }

    return data;
  }

  static getFormData(formId) {
    var data = this._getFormData(document.getElementById(formId));
    console.log(data);
    return data;
  }

  // put //////////////////////////////////////////////////////////////////////

  static _putImgInputData(input, data) {
    var name = input.children[0].attributes['name'] ? input.children[0].attributes['name'].value : null;

    if (! name) return 0;
    data = data[name];
    if (! data) return 0;

    if (! Array.isArray(data)) data = [data];

    for (var val of data) {
      var div = document.createElement("div");
      div.setAttribute('class', 'img-upload-obj');

      var img = document.createElement("img");
      img.setAttribute('src', attachmentsEndpoint + val);
      img.setAttribute('data-val', val);

      var btn = document.createElement("button");
      btn.onclick = function() {
        this.parentElement.remove();
      }

      div.appendChild(img);
      div.appendChild(btn);

      $(input).before(div);
    }

    return data.length;
  }

  static _putMultiStringInputData(input, data) {
    var name = input.children[1].attributes['name'] ? input.children[1].attributes['name'].value : null;

    if (! name) return;
    data = data[name];
    if (! data) return;

    for (var val of data) {
      val = String(val);
      if (val.length > 0) {
        var div = document.createElement("div");
        div.setAttribute('class', 'string-obj');
        div.setAttribute('data-string', val);
    
        var p = document.createElement("p");
        p.textContent = val;
    
        var btn = document.createElement("button");
        btn.setAttribute('class', 'remove-btn');
        btn.onclick = function() {
          this.parentElement.remove();
        }
    
        div.appendChild(p);
        div.appendChild(btn);

        input.children[0].appendChild(div);
      }
    }
  }

  static _putMultiFormData(form, data) {
    var name = form.attributes['data-name'] ? form.attributes['data-name'].value : null;

    if (! name) return;
    data = data[name];
    if (! data) return;

    for (var subData of data) {
      var subForm = $($(form).children('.template')[0])
        .clone()
        .removeClass("template")
        .addClass("sub-form")

      this._putFormData(subForm.get()[0], subData);

      $(form).append(subForm);

      $(".remove-btn").off("click");
      $(".remove-btn").click(function() {
        this.parentElement.remove();
      });

      setGlobalEventHandlers();
    }
  }

  static _putInputData(input, data) {
    var name = input.attributes['name'] ? input.attributes['name'].value : null;

    if (! name) return;
    data = data[name];
    if (! data) return;

    var type = input.type;
    switch (type) {
      case 'submit':
        return;

      case 'checkbox':
        input.checked = data
        break;

      case 'datetime-local':
        input.value = data.replace(' ', 'T')
        break;

      default:
        input.value = data ? String(data) : "";
    }

    if (input.onchange) input.onchange();
    $(input).change();
  }

  static _putFormData(form, data) {

    for (var i = 0; i < form.children.length; ++i) {
      var child = form.children[i];

      if (child.classList[0] == 'form-line' || child.classList[0] == 'form-box') {
        this._putFormData(child, data);
      }
      else {
        switch (child.tagName) {
          case 'DIV':
            switch (child.classList[0]) {
              case 'img-input':
                i += this._putImgInputData(child, data);
                break;

              case 'select':
                this._putFormData(child, data);
                break;

              case 'multistring-input':
                this._putMultiStringInputData(child, data);
                break;

              case 'multiform':
                this._putMultiFormData(child, data);
                break;

              case 'form-object': 
                this._putFormData(child, data[child.attributes['data-name'].value]);
                break;

              case 'form-array':
                this._putFormData(child, data[child.attributes['data-name'].value][0])
                break;

              default: break;
            }
            break;

          case 'SELECT':
          case 'INPUT':
          case 'TEXTAREA':
              this._putInputData(child, data);
            break;

          default: break;   // ignore others
        }
      }
    }

    return data;
  }

  static putFormData(formId, data) {
    this._putFormData(document.getElementById(formId), data);
  }

  static removeRedundancy(a, b) {
    var redundantKeys = []

    for (var key in b) {
      if (equals(a[key], b[key])) {
        redundantKeys.push(key);
      }
    }

    redundantKeys.forEach(_ => delete b[_]);

    return b;
  }

  static splitAttachments(data, keep, add) {
    if (data[add]) {
      data[keep] = [];

      data[add].forEach(_ => {
        if (_ && typeof _ == 'string') {
          data[keep].push(_);
        }
      });

      data[keep].forEach(_ => {
        const index = data[add].indexOf(_);
        if (index != -1) data[add].splice(index, 1);
      });
    }

    return data;
  }
}
