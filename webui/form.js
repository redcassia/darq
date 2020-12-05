
class ImgInput {

  constructor(element) {
    this.element = element;
  }

  get() {
    var name =
      this.element.children[0].attributes['name']
      ? this.element.children[0].attributes['name'].value
      : null;
    var data = [];

    for (var child of this.element.parentNode.children) {
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

    if (this.element.attributes['required'] && data.length == 0) {
      alert(
        getString('REQUIRED_FIELD_ALERT_1') + 
        this.element.attributes['data-friendly-name'].value +
        getString('REQUIRED_FIELD_ALERT_2')
      );
      throw new Error("Form validation failed");
    }

    var res = new Object();
    res[name] = this.element.classList.contains('multiple') ? data : data[0];

    return res;
  }

  put(data) {
    var name =
      this.element.children[0].attributes['name']
      ? this.element.children[0].attributes['name'].value
      : null;

    if (! name) return 0;
    data = data[name];
    if (! data) return 0;

    if (! Array.isArray(data)) data = [data];

    for (var val of data) {
      var div = document.createElement("div");
      div.setAttribute('class', 'img-upload-obj');

      var img = document.createElement("img");
      img.setAttribute('src', attachmentsEndpoint + '/thumb/' + val);
      img.setAttribute('data-val', val);

      var btn = document.createElement("button");
      btn.onclick = function() {
        this.parentElement.remove();
      }

      div.appendChild(img);
      div.appendChild(btn);

      $(this.element).before(div);
    }

    return data.length;
  }

  static applyEventHandlers() {
    $(".img-input").off("click");
    $(".img-input").click(function() {
      $(this).children()[0].click();
    });
    $(".img-input > input").off("change");
    $(".img-input > input").change(function() {
      var inp = this;
      var input = $(this);
      if (input.get()[0].files) {
        for (var file of input.get()[0].files) {
          var reader = new FileReader();

          reader.onload = function(e) {
            var div = document.createElement("div");
            div.setAttribute('class', 'img-upload-obj');

            var img = document.createElement("img");
            img.setAttribute('src', e.target.result);

            var btn = document.createElement("button");
            btn.onclick = function() {
              this.parentElement.remove();
            }

            var cloned = inp.cloneNode();
            cloned.setAttribute('class', 'hidden');
            div.appendChild(cloned);
            div.appendChild(img);
            div.appendChild(btn);

            var parent = input.parent();
            if (! parent.hasClass('multiple')) {
              parent.parent().children(".img-upload-obj").remove();
            }
            parent.before(div);
          };

          reader.readAsDataURL(file);
        }
      }
    });
  }
}

class MultiStringInput {

  constructor(element) {
    this.element = element;
  }

  get() {
    var name =
      this.element.attributes['data-name'] ?
      this.element.attributes['data-name'].value
      : null;
    var data = [];

    if (this.element.hasAttribute('data-multi-lang')) {
      for (var child of this.element.children[0].children) {
        if (child.classList[0] == 'string-obj') {
          data.push({
            en: child.attributes['data-string-en'].value,
            ar: child.attributes['data-string-ar'].value
          });
        }
      }

      var en = $(this.element).children('input[name="en"]')[0];
      var ar = $(this.element).children('input[name="ar"]')[0];

      if (en.value && en.value.length > 0 && ar.value && ar.value.length > 0) {
        data.push({
          en: en.value,
          ar: ar.value
        });
      }
    }
    else {
      for (var child of this.element.children[0].children) {
        if (child.classList[0] == 'string-obj') {
          data.push(child.attributes['data-string'].value)
        }
      }

      var inputVal = String(this.element.children[1].value);
      if (inputVal && inputVal.length > 0) {
        data.push(inputVal);
      }
    }

    if (this.element.attributes['required'] && data.length == 0) {
      alert(
        getString('REQUIRED_FIELD_ALERT_1') + 
        this.element.attributes['data-friendly-name'].value +
        getString('REQUIRED_FIELD_ALERT_2')
      );
      throw new Error("Form validation failed");
    }

    var res = new Object();
    res[name] = data;

    return res;
  }

  put(data) {
    var name =
      this.element.attributes['data-name']
      ? this.element.attributes['data-name'].value
      : null;

    if (! name) return;
    data = data[name];
    if (! data) return;

    const multi = this.element.hasAttribute('data-multi-lang');

    for (var val of data) {
      if (multi) {
        val = {
          en: String(val.en),
          ar: String(val.ar)
        }

        var div = document.createElement("div");
        div.setAttribute('class', 'string-obj');
        div.setAttribute('data-string-en', val.en);
        div.setAttribute('data-string-ar', val.ar);

        var p = document.createElement("p");
        p.textContent = val.en + "; " + val.ar;
      }
      else {
        val = String(val);

        var div = document.createElement("div");
        div.setAttribute('class', 'string-obj');
        div.setAttribute('data-string', val);

        var p = document.createElement("p");
        p.textContent = val;
      }

      var btn = document.createElement("button");
      btn.setAttribute('class', 'remove-btn');
      btn.onclick = function() {
        this.parentElement.remove();
      }

      div.appendChild(p);
      div.appendChild(btn);

      this.element.children[0].appendChild(div);
    }
  }

  static applyEventHandlers() {
    $(".multistring-input > button").off("click");
    $(".multistring-input > button").click(function() {

      if (this.parentNode.hasAttribute('data-multi-lang')) {
        var en = $(this).parent().children('input[name="en"]')[0];
        var ar = $(this).parent().children('input[name="ar"]')[0];

        if (en.value.length > 0 && ar.value.length > 0) {
          var div = document.createElement("div");
          div.setAttribute('class', 'string-obj');
          div.setAttribute('data-string-en', en.value);
          div.setAttribute('data-string-ar', ar.value);

          var p = document.createElement("p");
          p.textContent = en.value + "; " + ar.value;

          var btn = document.createElement("button");
          btn.setAttribute('class', 'remove-btn');
          btn.onclick = function() {
            this.parentElement.remove();
          }

          div.appendChild(p);
          div.appendChild(btn);

          $(this).parent().children('div')[0].append(div);
          en.value = "";
          ar.value = "";
        }
      }
      else {
        var inp = $(this).parent().children('input')[0];

        if (inp.value.length > 0) {
          var div = document.createElement("div");
          div.setAttribute('class', 'string-obj');
          div.setAttribute('data-string', inp.value);

          var p = document.createElement("p");
          p.textContent = inp.value;

          var btn = document.createElement("button");
          btn.setAttribute('class', 'remove-btn');
          btn.onclick = function() {
            this.parentElement.remove();
          }

          div.appendChild(p);
          div.appendChild(btn);

          $(this).parent().children('div')[0].append(div);
          inp.value = "";
        }
      }
    });
  }
}

class MultiFormInput {

  constructor(element) {
    this.element = element;
  }

  get() {
    var name =
      this.element.attributes['data-name']
      ? this.element.attributes['data-name'].value
      : null;
    var data = [];

    for (var child of this.element.children) {
      if (child.classList[0] == 'sub-form') {
        data.push(Form._getFormData(child));
      }
    }

    if (this.element.attributes['required'] && data.length == 0) {
      alert(
        getString('REQUIRED_FIELD_ALERT_1') + 
        this.element.attributes['data-friendly-name'].value +
        getString('REQUIRED_FIELD_ALERT_2')
      );
      throw new Error("Form validation failed");
    }

    var res = new Object();;
    res[name] = data;

    return res;
  }

  put(data) {
    var name =
      this.element.attributes['data-name']
      ? this.element.attributes['data-name'].value
      : null;

    if (! name) return;
    data = data[name];
    if (! data) return;

    for (var subData of data) {
      var subForm = $($(this.element).children('.template')[0])
        .clone()
        .removeClass("template")
        .addClass("sub-form")

      Form._putFormData(subForm.get()[0], subData);

      $(this.element).append(subForm);

      $(".remove-btn").off("click");
      $(".remove-btn").click(function() {
        this.parentElement.remove();
      });
    }

    Form.applyEventHandlers();
  }

  static applyEventHandlers() {
    $(".multiform > button").off("click");
    $(".multiform > button").click(function() {
      $(this).parent().append(
        $($(this).parent().children('.template')[0])
          .clone()
          .removeClass("template")
          .addClass("sub-form")
      );

      $(".remove-btn").off("click");
      $(".remove-btn").click(function() {
        this.parentElement.remove();
      });

      Form.applyEventHandlers();
    });
  }
}

class Form {

  // get //////////////////////////////////////////////////////////////////////

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
            case 'int':
              data = input.value ? parseInt(input.value) : null;
              break;

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

    if (input.attributes['required'] && (
      data === undefined ||
      data === null ||
      (data instanceof String && data.length == 0)
    )) {
      alert(
        getString('REQUIRED_FIELD_ALERT_1') + 
        input.attributes['data-friendly-name'].value +
        getString('REQUIRED_FIELD_ALERT_2')
      );
      throw new Error("Form validation failed");
    }

    var res = new Object();
    res[name] = data;

    return res;
  }

  static _getFormData(form) {

    var data = new Object();;

    for (var child of form.children) {
      if (child.classList[0] == 'form-line' || child.classList[0] == 'form-box') {
        if (! $(child).hasClass("hidden")) {
          data = { ...data, ...this._getFormData(child) };
        }
      }
      else {
        switch (child.tagName) {
          case 'DIV':
            switch (child.classList[0]) {
              case 'img-input':
                data = { ...data, ...new ImgInput(child).get() };
                break;

              case 'select':
                data = { ...data, ...this._getFormData(child) };
                break;

              case 'multistring-input':
                data = { ...data, ...new MultiStringInput(child).get() };
                break;

              case 'multiform':
                data = { ...data, ...new MultiFormInput(child).get() };
                break;

              case 'form-object': {
                if (! $(child).hasClass("hidden")) {
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
                i += new ImgInput(child).put(data);
                break;

              case 'select':
                this._putFormData(child, data);
                break;

              case 'multistring-input':
                new MultiStringInput(child).put(data);
                break;

              case 'multiform':
                new MultiFormInput(child).put(data);
                break;

              case 'form-object': {
                var obj = data[child.attributes['data-name'].value];
                if (obj) this._putFormData(child, obj);
              }
              break;

              case 'form-array': {
                var arr = data[child.attributes['data-name'].value][0];
                if (arr) this._putFormData(child, arr)
              }
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

  static setRequired(form, required) {
    for (var i = 0; i < form.children.length; ++i) {
      var child = form.children[i];

      if (child.classList[0] == 'form-line' || child.classList[0] == 'form-box') {
        this.setRequired(child, required);
      }
      else {
        switch (child.tagName) {
          case 'DIV':
            switch (child.classList[0]) {
              case 'multistring-input':
              case 'img-input':
              case 'form-object':
              case 'form-array':
                if (required) child.setAttribute('required', '');
                else child.removeAttribute('required')
                break;

              case 'select':
                this.setRequired(child, required);
                break;

              default: break;
            }
            break;

          case 'SELECT':
          case 'INPUT':
          case 'TEXTAREA':
            if (required) child.setAttribute('required', '');
            else child.removeAttribute('required')
            break;

          default: break;   // ignore others
        }
      }
    }
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

  static tryLock() {
    if (this.lock){
      return false;
    }
    else {
      this.lock = true;
      return true;
    }
  }

  static unlock() {
    this.lock = false;
  }

  static applyEventHandlers() {
    $("form").submit(function(e) {
      e.preventDefault();
    });

    ImgInput.applyEventHandlers();
    MultiStringInput.applyEventHandlers();
    MultiFormInput.applyEventHandlers();

    $("select").off("change");
    $("select").change(function() {
      if ($(this).val() == 'OTHER') {
        $(this).parent().parent().siblings(".show-if-other").removeClass("hidden");
      }
      else {
        $(this).parent().parent().siblings(".show-if-other").addClass("hidden");
      }
    });
  }
}

$(document).ready(Form.applyEventHandlers);
