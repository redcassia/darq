const _businessApproveStatus = {
  TENTATIVE: "Your business is waiting to be approved.",
  APPROVED: "Congratulations! Your business is approved and will be listed on DarQ in the next 24 hours.",
  APPROVED_AND_LISTED: "Your business is listed on DarQ!",
  REJECTED: "Your business information has been rejected. Please contact DarQ.",
};

const _businessUpdateApproveStatus = {
  TENTATIVE: "The updated data is waiting to be approved.",
  APPROVED: "The updated data has been approved and will be listed shortly.",
  APPROVED_AND_LISTED: "The updated data has been approved and listed on DarQ!",
  REJECTED: "The updated information has been rejected. Please contact the DarQ.",
};

const _eventApproveStatus = {
  TENTATIVE: "Your event is waiting to be approved.",
  APPROVED: "Congratulations! Your event is approved and will be listed on DarQ in the next 24 hours.",
  APPROVED_AND_LISTED: "Your event is listed on DarQ!",
  REJECTED: "Your event information has been rejected. Please contact DarQ.",
};

const __elementaryBusinessQueryFields = `
  id
  approved
  rating
  display_name
  display_picture
  city
  type
  ... on SelfEmployedBusiness_noLocale {
    selfEmployedSubType: sub_type
    sub_type_string { en ar }
    gender
    nationality
    phone_number
    description { en ar }
    skills { en ar }
    experience {
      country
      institution
      from
      to
      in_position
    }
    charge {
      value
      currency
    }
    government_id
    attachments
  }
  ... on ChildEducationBusiness_noLocale {
    childEducationSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    phone_number
    description { en ar }
    year_founded
    curriculum { en ar }
    attachments
  }
  ... on DomesticHelpBusiness_noLocale {
    domesticHelpSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    phone_number
    description { en ar }
    website
    personnel {
      name
      picture
      profession
      gender
      nationality
      religion
      salary {
        value
        currency
      }
      date_of_birth
      marital_status
      languages { en ar }
      experience {
        country
        institution
        from
        to
        in_position
      }
      phone_number
      ... on Driver_noLocale {
        license_expiry_date
      }
      attachments
      ... on Nanny_noLocale {
        education
        height
        weight
        skills { en ar }
        number_of_children
      }
      ... on Maid_noLocale {
        education
        height
        weight
        skills { en ar }
        number_of_children
      }
      ... on Cook_noLocale {
        education
        height
        weight
        skills { en ar }
        number_of_children
      }
    }
  }
  ... on BeautyBusiness_noLocale {
    beautySubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    home_service_available
    services { en ar }
    website
    attachments
  }
  ... on TransportationBusiness_noLocale {
    transportationSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    services { en ar }
    website
    attachments
  }
  ... on HospitalityBusiness_noLocale {
    hospitalitySubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    phone_number
    description { en ar }
    home_service_available
    optional_charge: charge {
      value
      currency
    }
    services { en ar }
    website
    attachments
  }
  ... on StationeryBusiness_noLocale {
    description { en ar }
    trade_license
    trade_license_number
    street_address
    phone_number
    website
    attachments
  }
  ... on MadeInQatarBusiness_noLocale {
    madeInQatarSubType: sub_type
    sub_type_string { en ar }
    street_address
    phone_number
    description { en ar }
    home_delivery_available
    products { en ar }
    website
    attachments
  }
  ... on SportsBusiness_noLocale {
    sportsSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    website
    attachments
    home_training_available
    classes { en ar }
    genders
    teams
  }
  ... on EntertainmentBusiness_noLocale {
    entertainmentSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    activities { en ar }
    website
    attachments
  }
  ... on FoodBusiness_noLocale {
    foodSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    website
    menu
    attachments
  }
  ... on CleaningAndMaintenanceBusiness_noLocale {
    cleaningAndMaintenanceSubType: sub_type
    sub_type_string { en ar }
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_number
    description { en ar }
    home_service_available
    optional_charge: charge {
      value
      currency
    }
    website
    attachments
  }
`;
const _businessQueryFields = `
  ${__elementaryBusinessQueryFields}
  update {
    ${__elementaryBusinessQueryFields}
  }
`;

const _eventQueryFields = `
  id
  approved
  display_name
  display_picture
  type
  city
  street_address
  phone_number
  description { en ar }
  duration {
    start
    end
  }
  hours {
    open
    close
    all_day
  }
  ticket_website
  ticket_price {
    value
    valueLower
    valueUpper
    currency
  }
  organizer
  attachments
`;

const graphqlEndpoint = 'https://redcassia.com:3000/api'
const attachmentsEndpoint = "https://redcassia.com:3000/attachment/";

function openInNewTab(url) {
  if (! url.startsWith("http")) url = 'https://' + url;
  console.log(`Opening ${url}`);
  var win = window.open(url, '_blank');
  win.focus();
}

function equals(a, b) {
  if (a === b) {
    return true;
  }
  else if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (! equals(a[i], b[i])) return false;
    }
    return true;
  }
  else if (a instanceof Object && b instanceof Object) {
    for (var key in a) {
      if (
        (b[key] === undefined && a[key] !== undefined) ||
        ! equals(a[key], b[key])
      ) return false;
    }
    for (var key in b) {
      if (
        a[key] === undefined && b[key] !== undefined
      ) return false;
    }
    return true;
  }
  else {
    return false;
  }
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

async function loadingScreen(func) {
  var showLoadingScreen = setTimeout(() => $("#loading-blanket").show(), 50);

  await func();

  clearTimeout(showLoadingScreen);
  $("#loading-blanket").hide();
}
