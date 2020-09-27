function changePassword() {
  var data;
  try {
    data = Form.getFormData('change-password-form');
  }
  catch (e) {
    console.log(e);
    return;
  }

  if (data["newPassword"].length < 8) {
    alert("Password must be 8 characters or more");
  }
  else if (data["newPassword"] != data["confirm"]) {
    alert("Passwords do not match!");
  }
  else {
    delete data["confirm"];

    GraphQL.mutation(`
      mutation ($oldPassword: String!, $newPassword: String!) {
        changeBusinessUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
      }
    `, data).then(res => {
      if (! res.hasError) {
        alert("Your password has been changed.");
        navigateTo('settings');
      }
      else {
        alert(res.errors[0]["message"]);
      }
    })
  }
}