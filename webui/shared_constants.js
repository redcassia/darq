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

const __elementaryBusinessQueryFields = `
  id
  approved
  rating
  display_name
  display_picture
  city
  type
  ... on SelfEmployedBusiness {
    selfEmployedSubType: sub_type
    sub_type_string
    gender
    nationality
    phone_number
    description
    skills
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
  ... on ChildEducationBusiness {
    childEducationSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    phone_numbers: phone_number
    description
    year_founded
    curriculum
    attachments
  }
  ... on DomesticHelpBusiness {
    domesticHelpSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    phone_numbers: phone_number
    description
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
      languages
      experience {
        country
        institution
        from
        to
        in_position
      }
      phone_number
      ... on Driver {
        license_expiry_date
      }
      ... on Nanny {
        education
        height
        weight
        skills
        number_of_children
      }
      ... on Maid {
        education
        height
        weight
        skills
        number_of_children
      }
      ... on Cook {
        education
        height
        weight
        skills
        number_of_children
      }
    }
  }
  ... on BeautyBusiness {
    beautySubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
    home_service_available
    services
    website
    attachments
  }
  ... on TransportationBusiness {
    transportationSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
    services
    website
    attachments
  }
  ... on HospitalityBusiness {
    hospitalitySubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    phone_numbers: phone_number
    description
    home_service_available
    optional_charge: charge {
      value
      currency
    }
    services
    website
    attachments
  }
  ... on StationeryBusiness {
    description
    trade_license
    trade_license_number
    street_address
    phone_numbers: phone_number
    website
    attachments
  }
  ... on MadeInQatarBusiness {
    madeInQatarSubType: sub_type
    sub_type_string
    street_address
    phone_numbers: phone_number
    description
    home_delivery_available
    products
    website
    attachments
  }
  ... on SportsBusiness {
    sportsSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
    website
    attachments
    home_training_available
    classes
    genders
    teams
  }
  ... on EntertainmentBusiness {
    entertainmentSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
    activities
    website
    attachments
  }
  ... on FoodBusiness {
    foodSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
    website
    menu
    attachments
  }
  ... on CleaningAndMaintenanceBusiness {
    cleaningAndMaintenanceSubType: sub_type
    sub_type_string
    trade_license
    trade_license_number
    street_address
    operating_hours {
      open
      close
      all_day
    }
    phone_numbers: phone_number
    description
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
  display_name
  display_picture
  type
  city
  street_address
  phone_number
  description
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

const graphqlEndpoint = 'https://redcassia.com:3001/api'
const attachmentsEndpoint = "https://redcassia.com:3001/attachment/";

function openInNewTab(url) {
  if (! url.startsWith("http")) url = 'https://' + url;
  console.log(`Opening ${url}`);
  var win = window.open(url, '_blank');
  win.focus();
}

function equals(a, b) {
  if (a == b) {
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
      if (! b[key] || ! equals(a[key], b[key])) return false;
    }
    for (var key in b) {
      if (! a[key]) return false;
    }
    return true;
  }
  else {
    return false;
  }
}

function isValidEmail(email) 
{
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}
