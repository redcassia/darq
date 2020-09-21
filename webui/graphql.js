class GraphQLResult {
  constructor(res) {
    console.log(res);

    this.hasError = res.errors != null
    this.errors = res.errors;
    this.data = res.data;
  }
}

class GraphQL {
  static url = graphqlEndpoint;

  static _prepareQueryBody(query, variables) {
    var body = new Object();;

    query = query.replace(/\s+/g, ' ').trim();
    body.query = query;

    if (variables) {
      body.variables = variables;
    }

    var start = query.startsWith("query") ? 5 : 8;
    var i = start;
    while (i < query.length && query.charAt(i) != '(' && query.charAt(i) != '{') ++i;
    var opName = query.substr(start, i - start).trim();
    if (opName.length > 0) {
      body.operationName = opName;
    }

    console.log(body);

    return JSON.stringify(body);
  }

  static _extractFilesFromVariables(variables, path = "variables") {

    var files = new Map();

    for (var key in variables) {
      var val = variables[key];
      if (val && typeof val == 'object') {
        if (val.constructor === File) {
          files[`${path}.${key}`] = val;
          variables[key] = null;
        }
        else {
          var child = this._extractFilesFromVariables(val, `${path}.${key}`);
          files = { ...files, ...child.files };
          variables[key] = child.vars;
        }
      }
    }

    return {
      vars: variables,
      files: files
    };
  }

  static _prepareMutationBody(mutation, variables) {
    var body = new FormData();

    var { vars, files } = this._extractFilesFromVariables(variables)

    body.append("operations", this._prepareQueryBody(mutation, vars));

    var i = 0;
    var map = new Object();;
    var f = new Object();;
    for (var key in files) {
      map[i] = [key];
      f[`${i}`] = files[key];
      ++i;
    }

    console.log(map);
    body.append("map", JSON.stringify(map));

    console.log(f);
    for (var key in f) {
      body.append(key, f[key]);
    }

    return body;
  }

  static query(q, variables) {

    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + CookieManager.get('token')
      },
      body: this._prepareQueryBody(q, variables)
    };

    return new Promise((resolve, reject) => {
      fetch(this.url, options)
        .then(async res => resolve(new GraphQLResult(await res.json())))
        .catch(e => reject(e));
    });
  }

  static mutation(m, variables) {

    const options = {
      method: "post",
      headers: {
        "Authorization": "Bearer " + CookieManager.get('token')
      },
      body: this._prepareMutationBody(m, variables)
    };

    return new Promise((resolve, reject) => {
      fetch(this.url, options)
      .then(async res => resolve(new GraphQLResult(await res.json())))
      .catch(e => reject(e));
    });
  }

  static async fillOptionsFromEnum(enumName, selectTagIds) {
    const res = await this.query(`
      query ($name: String!){
        __type(name: $name) {
          enumValues {
            name
          }
        }
      }
    `, {
      "name": enumName
    });

    selectTagIds.forEach(id => {
      var select = document.getElementById(id);
      for (var v of res.data.__type.enumValues) {
        select.innerHTML += `<option value='${v.name}'>${v.name}</option>`;
      }
    });
  }
}
