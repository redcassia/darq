const __elementaryBusinessQueryFields = `
  id
  approved
  rating
  display_name
  display_picture
  city
  type
  ... on SelfEmployedBusiness {
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
  ... on BeautyBusiness {
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

const attachmentsEndpoint = "http://localhost:7070/attachment/";

function openInNewTab(url) {
  if (! url.startsWith("http")) url = 'https://' + url;
  console.log(`Opening ${url}`);
  var win = window.open(url, '_blank');
  win.focus();
}
