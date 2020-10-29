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

const graphqlEndpoint = 'https://darq.qa/api'
const attachmentsEndpoint = "https://darq.qa/attachment/";

const enums = {
  SelfEmployedSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  ChildEducationSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  DomesticHelpSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  BeautyBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  TransportationBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  HospitalityBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  MadeInQatarBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  SportsBusinessSubType: {
    GYM: "Gym",
    CLUB: "Club",
  },
  EntertainmentBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  FoodBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  CleaningAndMaintenanceBusinessSubType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  EventType: {
    A: "A",
    B: "B",
    OTHER: "Other"
  },
  Profession: {
    Driver: "Driver",
    Nanny: "Nanny",
    Maid: "Maid",
    Cook: "Cook"
  },
  MaritalStatus: {
    SINGLE: "Single",
    MARRIED: "Married",
    DIVORCED: "Divorced",
    WIDOWED: "Widowed"
  },
  Education: {
    NONE: "No education",
    SECONDARY: "Secondary",
    POST_SECONDARY: "College / Post-secondary",
    POST_GRADUATE: "Post graduate"
  },
  Currency: {
    QAR: "QAR",
    USD: "USD",
  },
  City: {
    DOHA: "Doha",
    ABU_AZ_ZULUF: "Abu az Zuluf",
    ABU_THAYLAH: "Abu Thaylah",
    AD_DAWHAH_AL_JADIDAH: "Ad Dawhah al Jadidah",
    AL_ARISH: "Al `Arish",
    AL_BIDA_ASH_SHARQIYAH: "Al Bida` ash Sharqiyah",
    AL_GHANIM: "Al Ghanim",
    AL_GHUWARIYAH: "Al Ghuwariyah",
    AL_HILAL_AL_GHARBIYAH: "Al Hilal al Gharbiyah",
    AL_HILAL_ASH_SHARQIYAH: "Al Hilal ash Sharqiyah",
    AL_HITMI: "Al Hitmi",
    AL_JASRAH: "Al Jasrah",
    AL_JUMALIYAH: "Al Jumaliyah",
    AL_KA_BIYAH: "Al Ka`biyah",
    AL_KHALIFAT: "Al Khalifat",
    AL_KHOR: "Al Khor",
    AL_KHAWR: "Al Khawr",
    AL_KHUWAYR: "Al Khuwayr",
    AL_MAFJAR: "Al Mafjar",
    AL_QA_ABIYAH: "Al Qa`abiyah",
    AL_WAKRAH_SECOND_CITY: "Al Wakrah, second city",
    AL_ADHBAH: "Al `Adhbah",
    AN_NAJMAH: "An Najmah",
    AR_RAKIYAT: "Ar Rakiyat",
    AL_RAYYAN: "Al Rayyan",
    AR_RUAYS: "Ar Ru'ays",
    AS_SALATAH: "As Salatah",
    AS_SALATAH_AL_JADIDAH: "As Salatah al Jadidah",
    AS_SANI: "As Sani`",
    AS_SAWQ: "As Sawq",
    ATH_THAQAB: "Ath Thaqab",
    BLARE: "Blaré",
    DUKHAN: "Dukhan",
    RAS_LAFFAN_INDUSTRIAL_CITY: "Ras Laffan Industrial City",
    UMM_BAB: "Umm Bab",
    UMM_SAID: "Umm Sa'id",
    UMM_SALAL_ALI: "Umm Salal Ali",
    UMM_SALAL_MOHAMMED: "Umm Salal Mohammed",
    OTHER: "Other"
  },
  Gender: {
    FEMALE: "Female",
    MALE: "Male"
  },
  Genders: {
    FEMALE_ONLY: "Female only",
    MALE_ONLY: "Male only",
    MIXED: "Mixed"
  },
  Country: {
    QATAR: "Qatar",
    AFGHANISTAN: "Afghanistan",
    ALBANIA: "Albania",
    ALGERIA: "Algeria",
    ANDORRA: "Andorra",
    ANGOLA: "Angola",
    ANTIGUA_AND_BARBUDA: "Antigua and Barbuda",
    ARGENTINA: "Argentina",
    ARMENIA: "Armenia",
    AUSTRALIA: "Australia",
    AUSTRIA: "Austria",
    AZERBAIJAN: "Azerbaijan",
    THE_BAHAMAS: "The Bahamas",
    BAHRAIN: "Bahrain",
    BANGLADESH: "Bangladesh",
    BARBADOS: "Barbados",
    BELARUS: "Belarus",
    BELGIUM: "Belgium",
    BELIZE: "Belize",
    BENIN: "Benin",
    BHUTAN: "Bhutan",
    BOLIVIA: "Bolivia",
    BOSNIA_AND_HERZEGOVINA: "Bosnia and Herzegovina",
    BOTSWANA: "Botswana",
    BRAZIL: "Brazil",
    BRUNEI: "Brunei",
    BULGARIA: "Bulgaria",
    BURKINA_FASO: "Burkina Faso",
    BURUNDI: "Burundi",
    CABO_VERDE: "Cabo Verde",
    CAMBODIA: "Cambodia",
    CAMEROON: "Cameroon",
    CANADA: "Canada",
    CENTRAL_AFRICAN_REPUBLIC: "Central African Republic",
    CHAD: "Chad",
    CHILE: "Chile",
    CHINA: "China",
    COLOMBIA: "Colombia",
    COMOROS: "Comoros",
    CONGO__DEMOCRATIC_REPUBLIC_OF_THE: "Congo, Democratic Republic of the",
    CONGO__REPUBLIC_OF_THE: "Congo, Republic of the",
    COSTA_RICA: "Costa Rica",
    COTE_D_IVOIRE: "Côte d’Ivoire",
    CROATIA: "Croatia",
    CUBA: "Cuba",
    CYPRUS: "Cyprus",
    CZECH_REPUBLIC: "Czech Republic",
    DENMARK: "Denmark",
    DJIBOUTI: "Djibouti",
    DOMINICA: "Dominica",
    DOMINICAN_REPUBLIC: "Dominican Republic",
    EAST_TIMOR__TIMOR_LESTE_: "East Timor (Timor-Leste)",
    ECUADOR: "Ecuador",
    EGYPT: "Egypt",
    EL_SALVADOR: "El Salvador",
    EQUATORIAL_GUINEA: "Equatorial Guinea",
    ERITREA: "Eritrea",
    ESTONIA: "Estonia",
    ESWATINI: "Eswatini",
    ETHIOPIA: "Ethiopia",
    FIJI: "Fiji",
    FINLAND: "Finland",
    FRANCE: "France",
    GABON: "Gabon",
    THE_GAMBIA: "The Gambia",
    GEORGIA: "Georgia",
    GERMANY: "Germany",
    GHANA: "Ghana",
    GREECE: "Greece",
    GRENADA: "Grenada",
    GUATEMALA: "Guatemala",
    GUINEA: "Guinea",
    GUINEA_BISSAU: "Guinea-Bissau",
    GUYANA: "Guyana",
    HAITI: "Haiti",
    HONDURAS: "Honduras",
    HUNGARY: "Hungary",
    ICELAND: "Iceland",
    INDIA: "India",
    INDONESIA: "Indonesia",
    IRAN: "Iran",
    IRAQ: "Iraq",
    IRELAND: "Ireland",
    ISRAEL: "Israel",
    ITALY: "Italy",
    JAMAICA: "Jamaica",
    JAPAN: "Japan",
    JORDAN: "Jordan",
    KAZAKHSTAN: "Kazakhstan",
    KENYA: "Kenya",
    KIRIBATI: "Kiribati",
    KOREA__NORTH: "Korea, North",
    KOREA__SOUTH: "Korea, South",
    KOSOVO: "Kosovo",
    KUWAIT: "Kuwait",
    KYRGYZSTAN: "Kyrgyzstan",
    LAOS: "Laos",
    LATVIA: "Latvia",
    LEBANON: "Lebanon",
    LESOTHO: "Lesotho",
    LIBERIA: "Liberia",
    LIBYA: "Libya",
    LIECHTENSTEIN: "Liechtenstein",
    LITHUANIA: "Lithuania",
    LUXEMBOURG: "Luxembourg",
    MADAGASCAR: "Madagascar",
    MALAWI: "Malawi",
    MALAYSIA: "Malaysia",
    MALDIVES: "Maldives",
    MALI: "Mali",
    MALTA: "Malta",
    MARSHALL_ISLANDS: "Marshall Islands",
    MAURITANIA: "Mauritania",
    MAURITIUS: "Mauritius",
    MEXICO: "Mexico",
    MICRONESIA__FEDERATED_STATES_OF: "Micronesia, Federated States of",
    MOLDOVA: "Moldova",
    MONACO: "Monaco",
    MONGOLIA: "Mongolia",
    MONTENEGRO: "Montenegro",
    MOROCCO: "Morocco",
    MOZAMBIQUE: "Mozambique",
    MYANMAR__BURMA_: "Myanmar (Burma)",
    NAMIBIA: "Namibia",
    NAURU: "Nauru",
    NEPAL: "Nepal",
    NETHERLANDS: "Netherlands",
    NEW_ZEALAND: "New Zealand",
    NICARAGUA: "Nicaragua",
    NIGER: "Niger",
    NIGERIA: "Nigeria",
    NORTH_MACEDONIA: "North Macedonia",
    NORWAY: "Norway",
    OMAN: "Oman",
    PAKISTAN: "Pakistan",
    PALAU: "Palau",
    PANAMA: "Panama",
    PAPUA_NEW_GUINEA: "Papua New Guinea",
    PARAGUAY: "Paraguay",
    PERU: "Peru",
    PHILIPPINES: "Philippines",
    POLAND: "Poland",
    PORTUGAL: "Portugal",
    ROMANIA: "Romania",
    RUSSIA: "Russia",
    RWANDA: "Rwanda",
    SAINT_KITTS_AND_NEVIS: "Saint Kitts and Nevis",
    SAINT_LUCIA: "Saint Lucia",
    SAINT_VINCENT_AND_THE_GRENADINES: "Saint Vincent and the Grenadines",
    SAMOA: "Samoa",
    SAN_MARINO: "San Marino",
    SAO_TOME_AND_PRINCIPE: "Sao Tome and Principe",
    SAUDI_ARABIA: "Saudi Arabia",
    SENEGAL: "Senegal",
    SERBIA: "Serbia",
    SEYCHELLES: "Seychelles",
    SIERRA_LEONE: "Sierra Leone",
    SINGAPORE: "Singapore",
    SLOVAKIA: "Slovakia",
    SLOVENIA: "Slovenia",
    SOLOMON_ISLANDS: "Solomon Islands",
    SOMALIA: "Somalia",
    SOUTH_AFRICA: "South Africa",
    SPAIN: "Spain",
    SRI_LANKA: "Sri Lanka",
    SUDAN: "Sudan",
    SUDAN__SOUTH: "Sudan, South",
    SURINAME: "Suriname",
    SWEDEN: "Sweden",
    SWITZERLAND: "Switzerland",
    SYRIA: "Syria",
    TAIWAN: "Taiwan",
    TAJIKISTAN: "Tajikistan",
    TANZANIA: "Tanzania",
    THAILAND: "Thailand",
    TOGO: "Togo",
    TONGA: "Tonga",
    TRINIDAD_AND_TOBAGO: "Trinidad and Tobago",
    TUNISIA: "Tunisia",
    TURKEY: "Turkey",
    TURKMENISTAN: "Turkmenistan",
    TUVALU: "Tuvalu",
    UGANDA: "Uganda",
    UKRAINE: "Ukraine",
    UNITED_ARAB_EMIRATES: "United Arab Emirates",
    UNITED_KINGDOM: "United Kingdom",
    UNITED_STATES: "United States",
    URUGUAY: "Uruguay",
    UZBEKISTAN: "Uzbekistan",
    VANUATU: "Vanuatu",
    VATICAN_CITY: "Vatican City",
    VENEZUELA: "Venezuela",
    VIETNAM: "Vietnam",
    YEMEN: "Yemen",
    ZAMBIA: "Zambia",
    ZIMBABWE: "Zimbabwe"
  },
  Nationality: {
    QATARI: "Qatari",
    AFGHAN: "Afghan",
    ALBANIAN: "Albanian",
    ALGERIAN: "Algerian",
    AMERICAN: "American",
    ANDORRAN: "Andorran",
    ANGOLAN: "Angolan",
    ANGUILLAN: "Anguillan",
    ARGENTINE: "Argentine",
    ARMENIAN: "Armenian",
    AUSTRALIAN: "Australian",
    AUSTRIAN: "Austrian",
    AZERBAIJANI: "Azerbaijani",
    BAHAMIAN: "Bahamian",
    BAHRAINI: "Bahraini",
    BANGLADESHI: "Bangladeshi",
    BARBADIAN: "Barbadian",
    BELARUSIAN: "Belarusian",
    BELGIAN: "Belgian",
    BELIZEAN: "Belizean",
    BENINESE: "Beninese",
    BERMUDIAN: "Bermudian",
    BHUTANESE: "Bhutanese",
    BOLIVIAN: "Bolivian",
    BOTSWANAN: "Botswanan",
    BRAZILIAN: "Brazilian",
    BRITISH: "British",
    BRITISH_VIRGIN_ISLANDER: "British Virgin Islander",
    BRUNEIAN: "Bruneian",
    BULGARIAN: "Bulgarian",
    BURKINAN: "Burkinan",
    BURMESE: "Burmese",
    BURUNDIAN: "Burundian",
    CAMBODIAN: "Cambodian",
    CAMEROONIAN: "Cameroonian",
    CANADIAN: "Canadian",
    CAPE_VERDEAN: "Cape Verdean",
    CAYMAN_ISLANDER: "Cayman Islander",
    CENTRAL_AFRICAN: "Central African",
    CHADIAN: "Chadian",
    CHILEAN: "Chilean",
    CHINESE: "Chinese",
    CITIZEN_OF_ANTIGUA_AND_BARBUDA: "Citizen of Antigua and Barbuda",
    CITIZEN_OF_BOSNIA_AND_HERZEGOVINA: "Citizen of Bosnia and Herzegovina",
    CITIZEN_OF_GUINEA_BISSAU: "Citizen of Guinea-Bissau",
    CITIZEN_OF_KIRIBATI: "Citizen of Kiribati",
    CITIZEN_OF_SEYCHELLES: "Citizen of Seychelles",
    CITIZEN_OF_THE_DOMINICAN_REPUBLIC: "Citizen of the Dominican Republic",
    CITIZEN_OF_VANUATU: "Citizen of Vanuatu ",
    COLOMBIAN: "Colombian",
    COMORAN: "Comoran",
    CONGOLESE__CONGO_: "Congolese (Congo)",
    CONGOLESE__DRC_: "Congolese (DRC)",
    COOK_ISLANDER: "Cook Islander",
    COSTA_RICAN: "Costa Rican",
    CROATIAN: "Croatian",
    CUBAN: "Cuban",
    CYMRAES: "Cymraes",
    CYMRO: "Cymro",
    CYPRIOT: "Cypriot",
    CZECH: "Czech",
    DANISH: "Danish",
    DJIBOUTIAN: "Djiboutian",
    DOMINICAN: "Dominican",
    DUTCH: "Dutch",
    EAST_TIMORESE: "East Timorese",
    ECUADOREAN: "Ecuadorean",
    EGYPTIAN: "Egyptian",
    EMIRATI: "Emirati",
    ENGLISH: "English",
    EQUATORIAL_GUINEAN: "Equatorial Guinean",
    ERITREAN: "Eritrean",
    ESTONIAN: "Estonian",
    ETHIOPIAN: "Ethiopian",
    FAROESE: "Faroese",
    FIJIAN: "Fijian",
    FILIPINO: "Filipino",
    FINNISH: "Finnish",
    FRENCH: "French",
    GABONESE: "Gabonese",
    GAMBIAN: "Gambian",
    GEORGIAN: "Georgian",
    GERMAN: "German",
    GHANAIAN: "Ghanaian",
    GIBRALTARIAN: "Gibraltarian",
    GREEK: "Greek",
    GREENLANDIC: "Greenlandic",
    GRENADIAN: "Grenadian",
    GUAMANIAN: "Guamanian",
    GUATEMALAN: "Guatemalan",
    GUINEAN: "Guinean",
    GUYANESE: "Guyanese",
    HAITIAN: "Haitian",
    HONDURAN: "Honduran",
    HONG_KONGER: "Hong Konger",
    HUNGARIAN: "Hungarian",
    ICELANDIC: "Icelandic",
    INDIAN: "Indian",
    INDONESIAN: "Indonesian",
    IRANIAN: "Iranian",
    IRAQI: "Iraqi",
    IRISH: "Irish",
    ISRAELI: "Israeli",
    ITALIAN: "Italian",
    IVORIAN: "Ivorian",
    JAMAICAN: "Jamaican",
    JAPANESE: "Japanese",
    JORDANIAN: "Jordanian",
    KAZAKH: "Kazakh",
    KENYAN: "Kenyan",
    KITTITIAN: "Kittitian",
    KOSOVAN: "Kosovan",
    KUWAITI: "Kuwaiti",
    KYRGYZ: "Kyrgyz",
    LAO: "Lao",
    LATVIAN: "Latvian",
    LEBANESE: "Lebanese",
    LIBERIAN: "Liberian",
    LIBYAN: "Libyan",
    LIECHTENSTEIN_CITIZEN: "Liechtenstein citizen",
    LITHUANIAN: "Lithuanian",
    LUXEMBOURGER: "Luxembourger",
    MACANESE: "Macanese",
    MACEDONIAN: "Macedonian",
    MALAGASY: "Malagasy",
    MALAWIAN: "Malawian",
    MALAYSIAN: "Malaysian",
    MALDIVIAN: "Maldivian",
    MALIAN: "Malian",
    MALTESE: "Maltese",
    MARSHALLESE: "Marshallese",
    MARTINIQUAIS: "Martiniquais",
    MAURITANIAN: "Mauritanian",
    MAURITIAN: "Mauritian",
    MEXICAN: "Mexican",
    MICRONESIAN: "Micronesian",
    MOLDOVAN: "Moldovan",
    MONEGASQUE: "Monegasque",
    MONGOLIAN: "Mongolian",
    MONTENEGRIN: "Montenegrin",
    MONTSERRATIAN: "Montserratian",
    MOROCCAN: "Moroccan",
    MOSOTHO: "Mosotho",
    MOZAMBICAN: "Mozambican",
    NAMIBIAN: "Namibian",
    NAURUAN: "Nauruan",
    NEPALESE: "Nepalese",
    NEW_ZEALANDER: "New Zealander",
    NICARAGUAN: "Nicaraguan",
    NIGERIAN: "Nigerian",
    NIGERIEN: "Nigerien",
    NIUEAN: "Niuean",
    NORTH_KOREAN: "North Korean",
    NORTHERN_IRISH: "Northern Irish",
    NORWEGIAN: "Norwegian",
    OMANI: "Omani",
    PAKISTANI: "Pakistani",
    PALAUAN: "Palauan",
    PALESTINIAN: "Palestinian",
    PANAMANIAN: "Panamanian",
    PAPUA_NEW_GUINEAN: "Papua New Guinean",
    PARAGUAYAN: "Paraguayan",
    PERUVIAN: "Peruvian",
    PITCAIRN_ISLANDER: "Pitcairn Islander",
    POLISH: "Polish",
    PORTUGUESE: "Portuguese",
    PRYDEINIG: "Prydeinig",
    PUERTO_RICAN: "Puerto Rican",
    ROMANIAN: "Romanian",
    RUSSIAN: "Russian",
    RWANDAN: "Rwandan",
    SALVADOREAN: "Salvadorean",
    SAMMARINESE: "Sammarinese",
    SAMOAN: "Samoan",
    SAO_TOMEAN: "Sao Tomean",
    SAUDI_ARABIAN: "Saudi Arabian",
    SCOTTISH: "Scottish",
    SENEGALESE: "Senegalese",
    SERBIAN: "Serbian",
    SIERRA_LEONEAN: "Sierra Leonean",
    SINGAPOREAN: "Singaporean",
    SLOVAK: "Slovak",
    SLOVENIAN: "Slovenian",
    SOLOMON_ISLANDER: "Solomon Islander",
    SOMALI: "Somali",
    SOUTH_AFRICAN: "South African",
    SOUTH_KOREAN: "South Korean",
    SOUTH_SUDANESE: "South Sudanese",
    SPANISH: "Spanish",
    SRI_LANKAN: "Sri Lankan",
    ST_HELENIAN: "St Helenian",
    ST_LUCIAN: "St Lucian",
    STATELESS: "Stateless",
    SUDANESE: "Sudanese",
    SURINAMESE: "Surinamese",
    SWAZI: "Swazi",
    SWEDISH: "Swedish",
    SWISS: "Swiss",
    SYRIAN: "Syrian",
    TAIWANESE: "Taiwanese",
    TAJIK: "Tajik",
    TANZANIAN: "Tanzanian",
    THAI: "Thai",
    TOGOLESE: "Togolese",
    TONGAN: "Tongan",
    TRINIDADIAN: "Trinidadian",
    TRISTANIAN: "Tristanian",
    TUNISIAN: "Tunisian",
    TURKISH: "Turkish",
    TURKMEN: "Turkmen",
    TURKS_AND_CAICOS_ISLANDER: "Turks and Caicos Islander",
    TUVALUAN: "Tuvaluan",
    UGANDAN: "Ugandan",
    UKRAINIAN: "Ukrainian",
    URUGUAYAN: "Uruguayan",
    UZBEK: "Uzbek",
    VATICAN_CITIZEN: "Vatican citizen",
    VENEZUELAN: "Venezuelan",
    VIETNAMESE: "Vietnamese",
    VINCENTIAN: "Vincentian",
    WALLISIAN: "Wallisian",
    WELSH: "Welsh",
    YEMENI: "Yemeni",
    ZAMBIAN: "Zambian",
    ZIMBABWEAN: "Zimbabwean"
  }
};

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
