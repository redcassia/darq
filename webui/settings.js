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
    alert(getString('SHORT_PASSWORD_ALERT'));
  }
  else if (data["newPassword"] != data["confirm"]) {
    alert(getString('MISMATCHING_PASSWORDS_ALERT'));
  }
  else {
    delete data["confirm"];

    GraphQL.mutation(`
      mutation ($oldPassword: String!, $newPassword: String!) {
        changeBusinessUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
      }
    `, data).then(async (res) => {
      if (! res.hasError) {
        await alert(getString('PASSWORD_CHANGE_SUCCESS_ALERT'));
        navigateTo('settings');
      }
      else {
        await alert(getString('PASSWORD_CHANGE_FAIL_ALERT'));
      }
    })
  }
}

$(document).ready(Form.applyEventHandlers);
