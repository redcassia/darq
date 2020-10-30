
const graphqlEndpoint = 'https://darq.qa/api'
const attachmentsEndpoint = "https://darq.qa/attachment/";

const strings = {
  BUSINESS_APPROVE_STATUS: {
    en: {
      TENTATIVE: "Your business is waiting to be approved.",
      APPROVED: "Congratulations! Your business is approved and will be listed on DarQ in the next 24 hours.",
      APPROVED_AND_LISTED: "Your business is listed on DarQ!",
      REJECTED: "Your business information has been rejected. Please contact DarQ administrators.",
    },
    ar: {
      TENTATIVE: "عملك ينتظر الموافقة.",
      APPROVED: "تهانينا! تمت الموافقة على عملك وسيتم إدراجه في DarQ خلال الـ 24 ساعة القادمة.",
      APPROVED_AND_LISTED: "عملك مدرج في DarQ!",
      REJECTED: "تم رفض معلومات عملك. يرجى الاتصال بمسؤولي DarQ.",
    },
  },

  BUSINESS_UPDATE_APPROVE_STATUS: {
    en: {
      TENTATIVE: "The updated data is waiting to be approved.",
      APPROVED: "The updated data has been approved and will be listed shortly.",
      APPROVED_AND_LISTED: "The updated data has been approved and listed on DarQ!",
      REJECTED: "The updated information has been rejected. Please contact the DarQ administrators.",
    },
    ar: {
      TENTATIVE: "البيانات المحدثة في انتظار الموافقة عليها.",
      APPROVED: "تمت الموافقة على البيانات المحدثة وسيتم إدراجها قريبًا.",
      APPROVED_AND_LISTED: "تمت الموافقة على البيانات المحدثة وإدراجها في DarQ!",
      REJECTED: "تم رفض المعلومات المحدثة. يرجى الاتصال بمسؤولي DarQ.",
    },
  },

  EVENT_APPROVE_STATUS: {
    en: {
      TENTATIVE: "Your event is waiting to be approved.",
      APPROVED: "Congratulations! Your event is approved and will be listed on DarQ in the next 24 hours.",
      APPROVED_AND_LISTED: "Your event is listed on DarQ!",
      REJECTED: "Your event information has been rejected. Please contact DarQ administrators.",
    },
    ar: {
      TENTATIVE: "حدثك ينتظر الموافقة عليه.",
      APPROVED: "تهانينا! تمت الموافقة على الحدث الخاص بك وسيتم إدراجه في DarQ خلال الـ 24 ساعة القادمة.",
      APPROVED_AND_LISTED: "حدثك مدرج في DarQ!",
      REJECTED: "تم رفض معلومات الحدث الخاص بك. يرجى الاتصال بمسؤولي DarQ.",
    },
  },

  BUSINESS_ADD_SUCCESS_ALERT: {
    en: "Your business has been added. The data will be reviewed and we will contact you shortly.",
    ar: "تمت إضافة عملك. ستتم مراجعة البيانات وسنتصل بك قريبًا.",
  },

  BUSINESS_ADD_FAIL_ALERT: {
    en: "Failed to add business.",
    ar: "فشل إضافة العمل.",
  },

  BUSINESS_UPDATE_SUCCESS_ALERT: {
    en: "Your business has been updated. The data will be reviewed and we will contact you shortly.",
    ar: "تم تحديث عملك. ستتم مراجعة البيانات وسنتصل بك قريبًا.",
  },

  BUSINESS_UPDATE_FAIL_ALERT: {
    en: "Failed to update business.",
    ar: "فشل تحديث العمل",
  },

  REJECTED: {
    en: "REJECTED",
    ar: "مرفوض",
  },

  EDIT: {
    en: "Edit",
    ar: "تعديل",
  },

  MISSING_EMAIL_ALERT: {
    en: "Please enter your email.",
    ar: "يرجى إدخال البريد الإلكتروني الخاص بك.",
  },

  INVALID_EMAIL_ALERT: {
    en: "Please enter a valid email address.",
    ar: "يرجى إدخال بريد إلكتروني صالح.",
  },

  MISSING_PASSWORD_ALERT: {
    en: "Please enter your password.",
    ar: "يرجى إدخال كلمة السر.",
  },

  SHORT_PASSWORD_ALERT: {
    en: "Your password must be 8 characters or more.",
    ar: "يجب أن تتكون كلمة السر الخاصة بك من 8 أحرف أو أكثر.",
  },

  MISSING_PASSWORD_CONFIRM_ALERT: {
    en: "Please confirm your password.",
    ar: "يرجى تأكيد كلمة السر الخاصة بك.",
  },

  MISMATCHING_PASSWORDS_ALERT: {
    en: "Passwords do not match.",
    ar: "كلمة السر غير مطابقة.",
  },

  SINGUP_SUCCESS_ALERT: {
    en: "Your account has been created. Please check your inbox to activate your account.",
    ar: "لقد تم إنشاء حسابك. يرجى التحقق من البريد الوارد الخاص بك لتفعيل حسابك.",
  },

  SINGIN_REJECTED_ALERT: {
    en: "Invalid email or password.",
    ar: "البريد الإلكتروني أو كلمة السر خاطئة.",
  },

  CONFIRM_LOGOUT: {
    en: "Are you sure you want to Logout?",
    ar: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
  },

  RESET_PASSWORD_REQUEST_SUCCESS_ALERT: {
    en: "Please check your email.",
    ar: "يرجى التحقق من بريدك الالكتروني.",
  },

  RESET_PASSWORD_REQUEST_FAIL_ALERT: {
    en: "Failed to request a password reset.",
    ar: "فشل طلب إعادة تعيين كلمة السر.",
  },

  RESET_PASSWORD_FAIL_ALERT: {
    en: "Reset password failed.",
    ar: "فشل إعادة تعيين كلمة السر.",
  },

  YOU: {
    en: "You",
    ar: "أنت",
  },

  NEW_MESSAGES: {
    en: "New messages",
    ar: "رسائل جديدة",
  },

  PASSWORD_CHANGE_SUCCESS_ALERT: {
    en: "Your password has been changed.",
    ar: "تم تغيير كلمة السر الخاصة بك.",
  },

  PASSWORD_CHANGE_FAIL_ALERT: {
    en: "Password change failed.",
    ar: "فشل تغيير كلمة السر.",
  },

  REQUIRED_FIELD_ALERT_1: {
    en: "",
    ar: "لا يمكن ترك ",
  },

  REQUIRED_FIELD_ALERT_2: {
    en: " cannot be left empty",
    ar: " فارغا"
  },

  EXPERIENCE: {
    en: "Experience",
    ar: "الخبرة",
  },

  PRESENT: {
    en: "Present",
    ar: "الحاضر",
  },

  NOT_RATED: {
    en: "Not yet rated",
    ar: "لم يتم تقييمه بعد",
  },

  _24_HRS: {
    en: "24 hrs",
    ar: "24 ساعة",
  },

  HOME_SERIVCE: {
    en: "Home Service",
    ar: "خدمات منزلية",
  },

  HOME_DELIVERY: {
    en: "Home Delivery",
    ar: "خدمة التوصيل للمنزل",
  },

  HOME_TRAINING: {
    en: "Home Training",
    ar: "التدريب المنزلي",
  },

  AVAILABLE: {
    en: "Available",
    ar: "متاح",
  },

  NOT_AVAILABLE: {
    en: "Not available",
    ar: "غير متاح",
  },

  SERVICES: {
    en: "Services",
    ar: "الخدمات",
  },

  PRODUCTS: {
    en: "Products",
    ar: "المنتجات",
  },

  CLASSES: {
    en: "Classes",
    ar: "الدروس الرياضية",
  },

  TEAMS: {
    en: "Teams",
    ar: "الفرق الرياضية",
  },

  ACTIVITIES: {
    en: "Activities",
    ar: "الأنشطة",
  },

  SKILLS: {
    en: "Skills",
    ar: "المهارات",
  },

  CHARGE: {
    en: "Charge",
    ar: "التكلفة",
  },

  FOUNDED: {
    en: "Founded",
    ar: "تأسست",
  },

  CURRICULUM: {
    en: "Curriculum",
    ar: "المناهج الدراسية",
  },

  GOVERNMENT_ISSUED_ID: {
    en: "Government-issued ID",
    ar: "بطاقة هوية صادرة عن جهة حكومية",
  },

  TRADE_LICENSE: {
    en: "Trade license",
    ar: "الرخصة التجارية",
  },

  TRADE_LICENSE_NUMBER: {
    en: "Trade license number",
    ar: "رقم الرخصة التجارية",
  },

  GENDER: {
    en: "Gender",
    ar: "الجنس",
  },

  WEBSITE: {
    en: "Website",
    ar: "الموقع الكتروني",
  },

  MENU: {
    en: "Menu",
    ar: "قائمة الطعام",
  },

  PHOTOS: {
    en: "Photos",
    ar: "الصور",
  },

  START: {
    en: "Start",
    ar: "يبدأ",
  },

  END: {
    en: "End",
    ar: "ينتهي",
  },

  TICKET_RESERVATION: {
    en: "Ticket Reservation",
    ar: "حجز التذاكر",
  },

  TICKET_PRICE: {
    en: "Ticket Price",
    ar: "سعر التذكرة",
  },

  ORGANIZER: {
    en: "Organizer",
    ar: "المنظم",
  },
}

function getString(str) {
  return strings[str][CookieManager.get("locale")];
}

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

const enums = {
  SelfEmployedSubType: {
    SOCIAL_MEDIA_SPECIALIST: {
      en: "Social Media Specialist",
      ar: "أخصائي وسائل الاعلام الاجتماعية",
    },
    ACADEMIC_TUTOR: {
      en: "Academic Tutor",
      ar: "مدرس أكاديمي",
    },
    MUSIC_TUTOR: {
      en: "Music Tutor",
      ar: "مدرس موسيقى",
    },
    ENGLISH_TUTOR: {
      en: "English Tutor",
      ar: "مدرس لغة إنجليزية",
    },
    ARABIC_TUTOR: {
      en: "Arabic Tutor",
      ar: "مدرس لغة عربية",
    },
    SPANISH_TUTOR: {
      en: "Spanish Tutor",
      ar: "مدرس اسباني",
    },
    FRENCH_TUTOR: {
      en: "French Tutor",
      ar: "مدرس فرنسي",
    },
    GERMAN_TUTOR: {
      en: "German Tutor",
      ar: "مدرس ألماني",
    },
    ELDER_CARE: {
      en: "Elder Care",
      ar: "رعاية المسنين",
    },
    CONSULTANT: {
      en: "Consultant",
      ar: "استشاري",
    },
    VIDEO_PRODUCTION: {
      en: "Video Production",
      ar: "انتاج فيديو",
    },
    WRITER: {
      en: "Writer",
      ar: "كاتب",
    },
    WEB_DESIGNER: {
      en: "Web Designer",
      ar: "مصمم ويب",
    },
    BLOGGER: {
      en: "Blogger",
      ar: "مدون",
    },
    CAREER_COACH: {
      en: "Career Coach",
      ar: "مدرب مهني",
    },
    LIFE_COACH: {
      en: "Life Coach",
      ar: "مدرب الحياة",
    },
    VOICE_OVER_SPECIALIST: {
      en: "Voice-Over Specialist",
      ar: "اختصاصي الاصوات",
    },
    GRAPHIC_DESIGNER: {
      en: "Graphic Designer",
      ar: "مصمم جرافيك",
    },
    VIRTUAL_ASSISTANT: {
      en: "Virtual Assistant",
      ar: "مساعد افتراضي",
    },
    PET_SITTER: {
      en: "Pet Sitter",
      ar: "جليسة حيوانات أليفة",
    },
    PERSONAL_TRAINER: {
      en: "Personal Trainer",
      ar: "مدرب شخصي",
    },
    PHOTOGRAPHER: {
      en: "Photographer",
      ar: "مصور فوتوغرافي",
    },
    CARPENTER: {
      en: "Carpenter",
      ar: "نجار",
    },
    PAINTER: {
      en: "Painter",
      ar: "رسام",
    },
    REAL_ESTATE_BROKER: {
      en: "Real-estate Broker",
      ar: "سمسار عقارات",
    },
    PROGRAMMER: {
      en: "Programmer",
      ar: "مبرمج",
    },
    DIGITAL_MARKETER: {
      en: "Digital Marketer",
      ar: "مسوق رقمي",
    },
    DATA_ENTRY: {
      en: "Data Entry",
      ar: "ادخال بيانات",
    },
    ENGLISH_CONTENT_WRITER: {
      en: "English Content Writer",
      ar: "كاتب محتوى إنجليزي",
    },
    SALES_AGENT_ONLINE: {
      en: "Sales Agent Online",
      ar: "وكيل مبيعات على الإنترنت",
    },
    VIDEOGRAPHER: {
      en: "Videographer",
      ar: "مصور فيديو",
    },
    GAME_DEVELOPER: {
      en: "Game Developer",
      ar: "مطور العاب",
    },
    MOBILE_DEVELOPER: {
      en: "Mobile Developer",
      ar: "مطور موبايل",
    },
    MOTION_GRAPHIC_DESIGNER: {
      en: "Motion Graphic Designer",
      ar: "مصمم جرافيك موشن",
    },
    TRANSLATOR: {
      en: "Translator",
      ar: "مترجم",
    },
    NANNY: {
      en: "Nanny",
      ar: "مربية",
    },
    COOK: {
      en: "Cook",
      ar: "طباخ",
    },
    DRIVER: {
      en: "Driver",
      ar: "سائق",
    },
    NURSE: {
      en: "Nurse",
      ar: "ممرضة",
    },
    TEACHER: {
      en: "Teacher",
      ar: "مدرس",
    },
    EVENT_PLANNER: {
      en: "Event Planner",
      ar: "مخطط احداث",
    },
    STYLIST: {
      en: "Stylist",
      ar: "مصمم أزياء",
    },
    HAIR_STYLIST: {
      en: "Hair Stylist",
      ar: "مصفف شعر",
    },
    MAKEUP_ARTIST: {
      en: "Makeup Artist",
      ar: "خبيرة تجميل",
    },
    SPECIAL_NEEDS_TEACHER: {
      en: "Special Needs Teacher",
      ar: "مدرس احتياجات خاصة",
    },
    OTHER: {
      en: "Other",
      ar: "آخر",
    },
  },
  ChildEducationSubType: {
    SKILLS_DEVELOPMENT_CENTER: {
      en: "Skills Development Center",
      ar: "مركز تنمية المهارات",
    },
    EDUCATION_CENTER: {
      en: "Education Center",
      ar: "مركز تعليمي",
    },
    NURSERY: {
      en: "Nursery",
      ar: "حضانة",
    },
    SPECIAL_NEEDS_CENTER: {
      en: "Special Needs Center",
      ar: "مركز ذوي الاحتياجات الخاصة",
    },
    OTHER: {
      en: "Other",
      ar: "آخر",
    },
  },
  DomesticHelpSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر",
    }
  },
  BeautyBusinessSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر",
    }
  },
  TransportationBusinessSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر",
    }
  },
  HospitalityBusinessSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر",
    }
  },
  MadeInQatarBusinessSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر",
    }
  },
  SportsBusinessSubType: {
    GYM: {
      en: "Gym",
      ar: "صالون رياضي",
    },
    CLUB: {
      en: "Club",
      ar: "نادي رياضي",
    }
  },
  EntertainmentBusinessSubType: {
    PARK: {
      en: "Park",
      ar: "منتزه",
    },
    SHOPPING_MALL: {
      en: "Shopping Mall",
      ar: "مركز تسوق",
    },
    KIDS_PLAYING_AREA: {
      en: "Kids Playing Area",
      ar: "منطقة العاب الاطفال",
    },
    BIRTHDAY_AREA: {
      en: "Birthday Area",
      ar: "منطقة اعياد الميلاد",
    },
    OTHER: {
      en: "Other",
      ar: "آخر"
    }
  },
  FoodBusinessSubType: {
    AMERICAN_RESTAURANT: {
      en: "American Restaurant",
      ar: "مطعم أمريكي",
    },
    ARGENTINEAN_RESTAURANT: {
      en: "Argentinean Restaurant",
      ar: "مطعم أرجنتيني",
    },
    ARABIAN_RESTAURANT: {
      en: "Arabian Restaurant",
      ar: "مطعم عربي",
    },
    ASIAN_RESTAURANT: {
      en: "Asian Restaurant",
      ar: "مطعم آسيوي",
    },
    AUSTRALIAN_RESTAURANT: {
      en: "Australian Restaurant",
      ar: "مطعم استرالي",
    },
    CHINESE_RESTAURANT: {
      en: "Chinese Restaurant",
      ar: "مطعم صيني",
    },
    EUROPEAN_RESTAURANT: {
      en: "European Restaurant",
      ar: "مطعم أوروبي",
    },
    FRENCH_RESTAURANT: {
      en: "French Restaurant",
      ar: "مطعم فرنسي",
    },
    LEBANESE_RESTAURANT: {
      en: "Lebanese Restaurant",
      ar: "مطعم لبناني",
    },
    MEXICAN_RESTAURANT: {
      en: "Mexican Restaurant",
      ar: "مطعم مكسيكي",
    },
    ORIENTAL_RESTAURANT: {
      en: "Oriental Restaurant",
      ar: "مطعم شرقي",
    },
    OTHER: {
      en: "Other",
      ar: "آخر"
    }
  },
  CleaningAndMaintenanceBusinessSubType: {
    OTHER: {
      en: "Other",
      ar: "آخر"
    }
  },
  EventType: {
    OTHER: {
      en: "Other",
      ar: "آخر"
    }
  },
  Profession: {
    Driver: {
      en: "Driver",
    },
    Nanny: {
      en: "Nanny",
    },
    Maid: {
      en: "Maid",
    },
    Cook: {
      en: "Cook",
    },
  },
  MaritalStatus: {
    SINGLE: {
      en: "Single",
    },
    MARRIED: {
      en: "Married",
    },
    DIVORCED: {
      en: "Divorced",
    },
    WIDOWED: {
      en: "Widowed",
    },
  },
  Education: {
    NONE: {
      en: "No education",
    },
    SECONDARY: {
      en: "Secondary",
    },
    POST_SECONDARY: {
      en: "College / Post-secondary",
    },
    POST_GRADUATE: {
      en: "Post graduate",
    },
  },
  Currency: {
    QAR: {
      en: "QAR",
    },
    USD: {
      en: "USD",
    },
  },
  City: {
    DOHA: {
      en: "Doha",
    },
    ABU_AZ_ZULUF: {
      en: "Abu az Zuluf",
    },
    ABU_THAYLAH: {
      en: "Abu Thaylah",
    },
    AL_ARISH: {
      en: "Al `Arish",
    },
    AL_GHUWARIYAH: {
      en: "Al Ghuwariyah",
    },
    AL_JUMALIYAH: {
      en: "Al Jumaliyah",
    },
    AL_KA_BIYAH: {
      en: "Al Ka`biyah",
    },
    AL_KHOR: {
      en: "Al Khoo",
    },
    KHOR_AL_UDAID: {
      en: "Khor Al Udaid",
    },	
    AL_MAFJAR: {
      en: "Al Mafjar",
    },
    AL_QA_ABIYAH: {
      en: "Al Qa`abiyah",
    },
    AL_WAKRAH: {
      en: "Al Wakrah",
    },
    AR_RAKIYAT: {
      en: "Ar Rakiyat",
    },
    AL_RAYYAN: {
      en: "Al Rayyan",
    },
    AL_RUWAIS: {
      en: "Al Ruwais",
    },
    ATH_THAQAB: {
      en: "Ath Thaqab",
    },
    DUKHAN: {
      en: "Dukhan",
    },
    RAS_LAFFAN_INDUSTRIAL_CITY: {
      en: "Ras Laffan Industrial City",
    },
    MESAIEED: {
      en: "Mesaieed",
    },
    AL_ZUBARA: {
      en: "Al Zubara",
    },
    UMM_BAB: {
      en: "Umm Bab",
    },
    UMM_SALAL_ALI: {
      en: "Umm Salal Ali",
    },
    UMM_SALAL_MOHAMMED: {
      en: "Umm Salal Mohammed",
    },
    OTHER: {
      en: "Other",
    },
  },
  Gender: {
    FEMALE: {
      en: "Female",
    },
    MALE: {
      en: "Male",
    },
  },
  Genders: {
    FEMALE_ONLY: {
      en: "Female only",
    },
    MALE_ONLY: {
      en: "Male only",
    },
    MIXED: {
      en: "Mixed",
    },
  },
  Country: {
    QATAR: {
      en: "Qatar",
    },
    AFGHANISTAN: {
      en: "Afghanistan",
    },
    ALBANIA: {
      en: "Albania",
    },
    ALGERIA: {
      en: "Algeria",
    },
    ANDORRA: {
      en: "Andorra",
    },
    ANGOLA: {
      en: "Angola",
    },
    ANTIGUA_AND_BARBUDA: {
      en: "Antigua and Barbuda",
    },
    ARGENTINA: {
      en: "Argentina",
    },
    ARMENIA: {
      en: "Armenia",
    },
    AUSTRALIA: {
      en: "Australia",
    },
    AUSTRIA: {
      en: "Austria",
    },
    AZERBAIJAN: {
      en: "Azerbaijan",
    },
    THE_BAHAMAS: {
      en: "The Bahamas",
    },
    BAHRAIN: {
      en: "Bahrain",
    },
    BANGLADESH: {
      en: "Bangladesh",
    },
    BARBADOS: {
      en: "Barbados",
    },
    BELARUS: {
      en: "Belarus",
    },
    BELGIUM: {
      en: "Belgium",
    },
    BELIZE: {
      en: "Belize",
    },
    BENIN: {
      en: "Benin",
    },
    BHUTAN: {
      en: "Bhutan",
    },
    BOLIVIA: {
      en: "Bolivia",
    },
    BOSNIA_AND_HERZEGOVINA: {
      en: "Bosnia and Herzegovina",
    },
    BOTSWANA: {
      en: "Botswana",
    },
    BRAZIL: {
      en: "Brazil",
    },
    BRUNEI: {
      en: "Brunei",
    },
    BULGARIA: {
      en: "Bulgaria",
    },
    BURKINA_FASO: {
      en: "Burkina Faso",
    },
    BURUNDI: {
      en: "Burundi",
    },
    CABO_VERDE: {
      en: "Cabo Verde",
    },
    CAMBODIA: {
      en: "Cambodia",
    },
    CAMEROON: {
      en: "Cameroon",
    },
    CANADA: {
      en: "Canada",
    },
    CENTRAL_AFRICAN_REPUBLIC: {
      en: "Central African Republic",
    },
    CHAD: {
      en: "Chad",
    },
    CHILE: {
      en: "Chile",
    },
    CHINA: {
      en: "China",
    },
    COLOMBIA: {
      en: "Colombia",
    },
    COMOROS: {
      en: "Comoros",
    },
    CONGO__DEMOCRATIC_REPUBLIC_OF_THE: {
      en: "Congo, Democratic Republic of the",
    },
    CONGO__REPUBLIC_OF_THE: {
      en: "Congo, Republic of the",
    },
    COSTA_RICA: {
      en: "Costa Rica",
    },
    COTE_D_IVOIRE: {
      en: "Côte d’Ivoire",
    },
    CROATIA: {
      en: "Croatia",
    },
    CUBA: {
      en: "Cuba",
    },
    CYPRUS: {
      en: "Cyprus",
    },
    CZECH_REPUBLIC: {
      en: "Czech Republic",
    },
    DENMARK: {
      en: "Denmark",
    },
    DJIBOUTI: {
      en: "Djibouti",
    },
    DOMINICA: {
      en: "Dominica",
    },
    DOMINICAN_REPUBLIC: {
      en: "Dominican Republic",
    },
    EAST_TIMOR__TIMOR_LESTE_: {
      en: "East Timor (Timor-Leste)",
    },
    ECUADOR: {
      en: "Ecuador",
    },
    EGYPT: {
      en: "Egypt",
    },
    EL_SALVADOR: {
      en: "El Salvador",
    },
    EQUATORIAL_GUINEA: {
      en: "Equatorial Guinea",
    },
    ERITREA: {
      en: "Eritrea",
    },
    ESTONIA: {
      en: "Estonia",
    },
    ESWATINI: {
      en: "Eswatini",
    },
    ETHIOPIA: {
      en: "Ethiopia",
    },
    FIJI: {
      en: "Fiji",
    },
    FINLAND: {
      en: "Finland",
    },
    FRANCE: {
      en: "France",
    },
    GABON: {
      en: "Gabon",
    },
    THE_GAMBIA: {
      en: "The Gambia",
    },
    GEORGIA: {
      en: "Georgia",
    },
    GERMANY: {
      en: "Germany",
    },
    GHANA: {
      en: "Ghana",
    },
    GREECE: {
      en: "Greece",
    },
    GRENADA: {
      en: "Grenada",
    },
    GUATEMALA: {
      en: "Guatemala",
    },
    GUINEA: {
      en: "Guinea",
    },
    GUINEA_BISSAU: {
      en: "Guinea-Bissau",
    },
    GUYANA: {
      en: "Guyana",
    },
    HAITI: {
      en: "Haiti",
    },
    HONDURAS: {
      en: "Honduras",
    },
    HUNGARY: {
      en: "Hungary",
    },
    ICELAND: {
      en: "Iceland",
    },
    INDIA: {
      en: "India",
    },
    INDONESIA: {
      en: "Indonesia",
    },
    IRAN: {
      en: "Iran",
    },
    IRAQ: {
      en: "Iraq",
    },
    IRELAND: {
      en: "Ireland",
    },
    ISRAEL: {
      en: "Israel",
    },
    ITALY: {
      en: "Italy",
    },
    JAMAICA: {
      en: "Jamaica",
    },
    JAPAN: {
      en: "Japan",
    },
    JORDAN: {
      en: "Jordan",
    },
    KAZAKHSTAN: {
      en: "Kazakhstan",
    },
    KENYA: {
      en: "Kenya",
    },
    KIRIBATI: {
      en: "Kiribati",
    },
    KOREA__NORTH: {
      en: "Korea, North",
    },
    KOREA__SOUTH: {
      en: "Korea, South",
    },
    KOSOVO: {
      en: "Kosovo",
    },
    KUWAIT: {
      en: "Kuwait",
    },
    KYRGYZSTAN: {
      en: "Kyrgyzstan",
    },
    LAOS: {
      en: "Laos",
    },
    LATVIA: {
      en: "Latvia",
    },
    LEBANON: {
      en: "Lebanon",
    },
    LESOTHO: {
      en: "Lesotho",
    },
    LIBERIA: {
      en: "Liberia",
    },
    LIBYA: {
      en: "Libya",
    },
    LIECHTENSTEIN: {
      en: "Liechtenstein",
    },
    LITHUANIA: {
      en: "Lithuania",
    },
    LUXEMBOURG: {
      en: "Luxembourg",
    },
    MADAGASCAR: {
      en: "Madagascar",
    },
    MALAWI: {
      en: "Malawi",
    },
    MALAYSIA: {
      en: "Malaysia",
    },
    MALDIVES: {
      en: "Maldives",
    },
    MALI: {
      en: "Mali",
    },
    MALTA: {
      en: "Malta",
    },
    MARSHALL_ISLANDS: {
      en: "Marshall Islands",
    },
    MAURITANIA: {
      en: "Mauritania",
    },
    MAURITIUS: {
      en: "Mauritius",
    },
    MEXICO: {
      en: "Mexico",
    },
    MICRONESIA__FEDERATED_STATES_OF: {
      en: "Micronesia, Federated States of",
    },
    MOLDOVA: {
      en: "Moldova",
    },
    MONACO: {
      en: "Monaco",
    },
    MONGOLIA: {
      en: "Mongolia",
    },
    MONTENEGRO: {
      en: "Montenegro",
    },
    MOROCCO: {
      en: "Morocco",
    },
    MOZAMBIQUE: {
      en: "Mozambique",
    },
    MYANMAR__BURMA_: {
      en: "Myanmar (Burma)",
    },
    NAMIBIA: {
      en: "Namibia",
    },
    NAURU: {
      en: "Nauru",
    },
    NEPAL: {
      en: "Nepal",
    },
    NETHERLANDS: {
      en: "Netherlands",
    },
    NEW_ZEALAND: {
      en: "New Zealand",
    },
    NICARAGUA: {
      en: "Nicaragua",
    },
    NIGER: {
      en: "Niger",
    },
    NIGERIA: {
      en: "Nigeria",
    },
    NORTH_MACEDONIA: {
      en: "North Macedonia",
    },
    NORWAY: {
      en: "Norway",
    },
    OMAN: {
      en: "Oman",
    },
    PAKISTAN: {
      en: "Pakistan",
    },
    PALAU: {
      en: "Palau",
    },
    PANAMA: {
      en: "Panama",
    },
    PAPUA_NEW_GUINEA: {
      en: "Papua New Guinea",
    },
    PARAGUAY: {
      en: "Paraguay",
    },
    PERU: {
      en: "Peru",
    },
    PHILIPPINES: {
      en: "Philippines",
    },
    POLAND: {
      en: "Poland",
    },
    PORTUGAL: {
      en: "Portugal",
    },
    ROMANIA: {
      en: "Romania",
    },
    RUSSIA: {
      en: "Russia",
    },
    RWANDA: {
      en: "Rwanda",
    },
    SAINT_KITTS_AND_NEVIS: {
      en: "Saint Kitts and Nevis",
    },
    SAINT_LUCIA: {
      en: "Saint Lucia",
    },
    SAINT_VINCENT_AND_THE_GRENADINES: {
      en: "Saint Vincent and the Grenadines",
    },
    SAMOA: {
      en: "Samoa",
    },
    SAN_MARINO: {
      en: "San Marino",
    },
    SAO_TOME_AND_PRINCIPE: {
      en: "Sao Tome and Principe",
    },
    SAUDI_ARABIA: {
      en: "Saudi Arabia",
    },
    SENEGAL: {
      en: "Senegal",
    },
    SERBIA: {
      en: "Serbia",
    },
    SEYCHELLES: {
      en: "Seychelles",
    },
    SIERRA_LEONE: {
      en: "Sierra Leone",
    },
    SINGAPORE: {
      en: "Singapore",
    },
    SLOVAKIA: {
      en: "Slovakia",
    },
    SLOVENIA: {
      en: "Slovenia",
    },
    SOLOMON_ISLANDS: {
      en: "Solomon Islands",
    },
    SOMALIA: {
      en: "Somalia",
    },
    SOUTH_AFRICA: {
      en: "South Africa",
    },
    SPAIN: {
      en: "Spain",
    },
    SRI_LANKA: {
      en: "Sri Lanka",
    },
    SUDAN: {
      en: "Sudan",
    },
    SUDAN__SOUTH: {
      en: "Sudan, South",
    },
    SURINAME: {
      en: "Suriname",
    },
    SWEDEN: {
      en: "Sweden",
    },
    SWITZERLAND: {
      en: "Switzerland",
    },
    SYRIA: {
      en: "Syria",
    },
    TAIWAN: {
      en: "Taiwan",
    },
    TAJIKISTAN: {
      en: "Tajikistan",
    },
    TANZANIA: {
      en: "Tanzania",
    },
    THAILAND: {
      en: "Thailand",
    },
    TOGO: {
      en: "Togo",
    },
    TONGA: {
      en: "Tonga",
    },
    TRINIDAD_AND_TOBAGO: {
      en: "Trinidad and Tobago",
    },
    TUNISIA: {
      en: "Tunisia",
    },
    TURKEY: {
      en: "Turkey",
    },
    TURKMENISTAN: {
      en: "Turkmenistan",
    },
    TUVALU: {
      en: "Tuvalu",
    },
    UGANDA: {
      en: "Uganda",
    },
    UKRAINE: {
      en: "Ukraine",
    },
    UNITED_ARAB_EMIRATES: {
      en: "United Arab Emirates",
    },
    UNITED_KINGDOM: {
      en: "United Kingdom",
    },
    UNITED_STATES: {
      en: "United States",
    },
    URUGUAY: {
      en: "Uruguay",
    },
    UZBEKISTAN: {
      en: "Uzbekistan",
    },
    VANUATU: {
      en: "Vanuatu",
    },
    VATICAN_CITY: {
      en: "Vatican City",
    },
    VENEZUELA: {
      en: "Venezuela",
    },
    VIETNAM: {
      en: "Vietnam",
    },
    YEMEN: {
      en: "Yemen",
    },
    ZAMBIA: {
      en: "Zambia",
    },
    ZIMBABWE: {
      en: "Zimbabwe",
    },
  },
  Nationality: {
    QATARI: {
      en: "Qatari",
    },
    AFGHAN: {
      en: "Afghan",
    },
    ALBANIAN: {
      en: "Albanian",
    },
    ALGERIAN: {
      en: "Algerian",
    },
    AMERICAN: {
      en: "American",
    },
    ANDORRAN: {
      en: "Andorran",
    },
    ANGOLAN: {
      en: "Angolan",
    },
    ANGUILLAN: {
      en: "Anguillan",
    },
    ARGENTINE: {
      en: "Argentine",
    },
    ARMENIAN: {
      en: "Armenian",
    },
    AUSTRALIAN: {
      en: "Australian",
    },
    AUSTRIAN: {
      en: "Austrian",
    },
    AZERBAIJANI: {
      en: "Azerbaijani",
    },
    BAHAMIAN: {
      en: "Bahamian",
    },
    BAHRAINI: {
      en: "Bahraini",
    },
    BANGLADESHI: {
      en: "Bangladeshi",
    },
    BARBADIAN: {
      en: "Barbadian",
    },
    BELARUSIAN: {
      en: "Belarusian",
    },
    BELGIAN: {
      en: "Belgian",
    },
    BELIZEAN: {
      en: "Belizean",
    },
    BENINESE: {
      en: "Beninese",
    },
    BERMUDIAN: {
      en: "Bermudian",
    },
    BHUTANESE: {
      en: "Bhutanese",
    },
    BOLIVIAN: {
      en: "Bolivian",
    },
    BOTSWANAN: {
      en: "Botswanan",
    },
    BRAZILIAN: {
      en: "Brazilian",
    },
    BRITISH: {
      en: "British",
    },
    BRITISH_VIRGIN_ISLANDER: {
      en: "British Virgin Islander",
    },
    BRUNEIAN: {
      en: "Bruneian",
    },
    BULGARIAN: {
      en: "Bulgarian",
    },
    BURKINAN: {
      en: "Burkinan",
    },
    BURMESE: {
      en: "Burmese",
    },
    BURUNDIAN: {
      en: "Burundian",
    },
    CAMBODIAN: {
      en: "Cambodian",
    },
    CAMEROONIAN: {
      en: "Cameroonian",
    },
    CANADIAN: {
      en: "Canadian",
    },
    CAPE_VERDEAN: {
      en: "Cape Verdean",
    },
    CAYMAN_ISLANDER: {
      en: "Cayman Islander",
    },
    CENTRAL_AFRICAN: {
      en: "Central African",
    },
    CHADIAN: {
      en: "Chadian",
    },
    CHILEAN: {
      en: "Chilean",
    },
    CHINESE: {
      en: "Chinese",
    },
    CITIZEN_OF_ANTIGUA_AND_BARBUDA: {
      en: "Citizen of Antigua and Barbuda",
    },
    CITIZEN_OF_BOSNIA_AND_HERZEGOVINA: {
      en: "Citizen of Bosnia and Herzegovina",
    },
    CITIZEN_OF_GUINEA_BISSAU: {
      en: "Citizen of Guinea-Bissau",
    },
    CITIZEN_OF_KIRIBATI: {
      en: "Citizen of Kiribati",
    },
    CITIZEN_OF_SEYCHELLES: {
      en: "Citizen of Seychelles",
    },
    CITIZEN_OF_THE_DOMINICAN_REPUBLIC: {
      en: "Citizen of the Dominican Republic",
    },
    CITIZEN_OF_VANUATU: {
      en: "Citizen of Vanuatu ",
    },
    COLOMBIAN: {
      en: "Colombian",
    },
    COMORAN: {
      en: "Comoran",
    },
    CONGOLESE__CONGO_: {
      en: "Congolese (Congo)",
    },
    CONGOLESE__DRC_: {
      en: "Congolese (DRC)",
    },
    COOK_ISLANDER: {
      en: "Cook Islander",
    },
    COSTA_RICAN: {
      en: "Costa Rican",
    },
    CROATIAN: {
      en: "Croatian",
    },
    CUBAN: {
      en: "Cuban",
    },
    CYMRAES: {
      en: "Cymraes",
    },
    CYMRO: {
      en: "Cymro",
    },
    CYPRIOT: {
      en: "Cypriot",
    },
    CZECH: {
      en: "Czech",
    },
    DANISH: {
      en: "Danish",
    },
    DJIBOUTIAN: {
      en: "Djiboutian",
    },
    DOMINICAN: {
      en: "Dominican",
    },
    DUTCH: {
      en: "Dutch",
    },
    EAST_TIMORESE: {
      en: "East Timorese",
    },
    ECUADOREAN: {
      en: "Ecuadorean",
    },
    EGYPTIAN: {
      en: "Egyptian",
    },
    EMIRATI: {
      en: "Emirati",
    },
    ENGLISH: {
      en: "English",
    },
    EQUATORIAL_GUINEAN: {
      en: "Equatorial Guinean",
    },
    ERITREAN: {
      en: "Eritrean",
    },
    ESTONIAN: {
      en: "Estonian",
    },
    ETHIOPIAN: {
      en: "Ethiopian",
    },
    FAROESE: {
      en: "Faroese",
    },
    FIJIAN: {
      en: "Fijian",
    },
    FILIPINO: {
      en: "Filipino",
    },
    FINNISH: {
      en: "Finnish",
    },
    FRENCH: {
      en: "French",
    },
    GABONESE: {
      en: "Gabonese",
    },
    GAMBIAN: {
      en: "Gambian",
    },
    GEORGIAN: {
      en: "Georgian",
    },
    GERMAN: {
      en: "German",
    },
    GHANAIAN: {
      en: "Ghanaian",
    },
    GIBRALTARIAN: {
      en: "Gibraltarian",
    },
    GREEK: {
      en: "Greek",
    },
    GREENLANDIC: {
      en: "Greenlandic",
    },
    GRENADIAN: {
      en: "Grenadian",
    },
    GUAMANIAN: {
      en: "Guamanian",
    },
    GUATEMALAN: {
      en: "Guatemalan",
    },
    GUINEAN: {
      en: "Guinean",
    },
    GUYANESE: {
      en: "Guyanese",
    },
    HAITIAN: {
      en: "Haitian",
    },
    HONDURAN: {
      en: "Honduran",
    },
    HONG_KONGER: {
      en: "Hong Konger",
    },
    HUNGARIAN: {
      en: "Hungarian",
    },
    ICELANDIC: {
      en: "Icelandic",
    },
    INDIAN: {
      en: "Indian",
    },
    INDONESIAN: {
      en: "Indonesian",
    },
    IRANIAN: {
      en: "Iranian",
    },
    IRAQI: {
      en: "Iraqi",
    },
    IRISH: {
      en: "Irish",
    },
    ISRAELI: {
      en: "Israeli",
    },
    ITALIAN: {
      en: "Italian",
    },
    IVORIAN: {
      en: "Ivorian",
    },
    JAMAICAN: {
      en: "Jamaican",
    },
    JAPANESE: {
      en: "Japanese",
    },
    JORDANIAN: {
      en: "Jordanian",
    },
    KAZAKH: {
      en: "Kazakh",
    },
    KENYAN: {
      en: "Kenyan",
    },
    KITTITIAN: {
      en: "Kittitian",
    },
    KOSOVAN: {
      en: "Kosovan",
    },
    KUWAITI: {
      en: "Kuwaiti",
    },
    KYRGYZ: {
      en: "Kyrgyz",
    },
    LAO: {
      en: "Lao",
    },
    LATVIAN: {
      en: "Latvian",
    },
    LEBANESE: {
      en: "Lebanese",
    },
    LIBERIAN: {
      en: "Liberian",
    },
    LIBYAN: {
      en: "Libyan",
    },
    LIECHTENSTEIN_CITIZEN: {
      en: "Liechtenstein citizen",
    },
    LITHUANIAN: {
      en: "Lithuanian",
    },
    LUXEMBOURGER: {
      en: "Luxembourger",
    },
    MACANESE: {
      en: "Macanese",
    },
    MACEDONIAN: {
      en: "Macedonian",
    },
    MALAGASY: {
      en: "Malagasy",
    },
    MALAWIAN: {
      en: "Malawian",
    },
    MALAYSIAN: {
      en: "Malaysian",
    },
    MALDIVIAN: {
      en: "Maldivian",
    },
    MALIAN: {
      en: "Malian",
    },
    MALTESE: {
      en: "Maltese",
    },
    MARSHALLESE: {
      en: "Marshallese",
    },
    MARTINIQUAIS: {
      en: "Martiniquais",
    },
    MAURITANIAN: {
      en: "Mauritanian",
    },
    MAURITIAN: {
      en: "Mauritian",
    },
    MEXICAN: {
      en: "Mexican",
    },
    MICRONESIAN: {
      en: "Micronesian",
    },
    MOLDOVAN: {
      en: "Moldovan",
    },
    MONEGASQUE: {
      en: "Monegasque",
    },
    MONGOLIAN: {
      en: "Mongolian",
    },
    MONTENEGRIN: {
      en: "Montenegrin",
    },
    MONTSERRATIAN: {
      en: "Montserratian",
    },
    MOROCCAN: {
      en: "Moroccan",
    },
    MOSOTHO: {
      en: "Mosotho",
    },
    MOZAMBICAN: {
      en: "Mozambican",
    },
    NAMIBIAN: {
      en: "Namibian",
    },
    NAURUAN: {
      en: "Nauruan",
    },
    NEPALESE: {
      en: "Nepalese",
    },
    NEW_ZEALANDER: {
      en: "New Zealander",
    },
    NICARAGUAN: {
      en: "Nicaraguan",
    },
    NIGERIAN: {
      en: "Nigerian",
    },
    NIGERIEN: {
      en: "Nigerien",
    },
    NIUEAN: {
      en: "Niuean",
    },
    NORTH_KOREAN: {
      en: "North Korean",
    },
    NORTHERN_IRISH: {
      en: "Northern Irish",
    },
    NORWEGIAN: {
      en: "Norwegian",
    },
    OMANI: {
      en: "Omani",
    },
    PAKISTANI: {
      en: "Pakistani",
    },
    PALAUAN: {
      en: "Palauan",
    },
    PALESTINIAN: {
      en: "Palestinian",
    },
    PANAMANIAN: {
      en: "Panamanian",
    },
    PAPUA_NEW_GUINEAN: {
      en: "Papua New Guinean",
    },
    PARAGUAYAN: {
      en: "Paraguayan",
    },
    PERUVIAN: {
      en: "Peruvian",
    },
    PITCAIRN_ISLANDER: {
      en: "Pitcairn Islander",
    },
    POLISH: {
      en: "Polish",
    },
    PORTUGUESE: {
      en: "Portuguese",
    },
    PRYDEINIG: {
      en: "Prydeinig",
    },
    PUERTO_RICAN: {
      en: "Puerto Rican",
    },
    ROMANIAN: {
      en: "Romanian",
    },
    RUSSIAN: {
      en: "Russian",
    },
    RWANDAN: {
      en: "Rwandan",
    },
    SALVADOREAN: {
      en: "Salvadorean",
    },
    SAMMARINESE: {
      en: "Sammarinese",
    },
    SAMOAN: {
      en: "Samoan",
    },
    SAO_TOMEAN: {
      en: "Sao Tomean",
    },
    SAUDI_ARABIAN: {
      en: "Saudi Arabian",
    },
    SCOTTISH: {
      en: "Scottish",
    },
    SENEGALESE: {
      en: "Senegalese",
    },
    SERBIAN: {
      en: "Serbian",
    },
    SIERRA_LEONEAN: {
      en: "Sierra Leonean",
    },
    SINGAPOREAN: {
      en: "Singaporean",
    },
    SLOVAK: {
      en: "Slovak",
    },
    SLOVENIAN: {
      en: "Slovenian",
    },
    SOLOMON_ISLANDER: {
      en: "Solomon Islander",
    },
    SOMALI: {
      en: "Somali",
    },
    SOUTH_AFRICAN: {
      en: "South African",
    },
    SOUTH_KOREAN: {
      en: "South Korean",
    },
    SOUTH_SUDANESE: {
      en: "South Sudanese",
    },
    SPANISH: {
      en: "Spanish",
    },
    SRI_LANKAN: {
      en: "Sri Lankan",
    },
    ST_HELENIAN: {
      en: "St Helenian",
    },
    ST_LUCIAN: {
      en: "St Lucian",
    },
    STATELESS: {
      en: "Stateless",
    },
    SUDANESE: {
      en: "Sudanese",
    },
    SURINAMESE: {
      en: "Surinamese",
    },
    SWAZI: {
      en: "Swazi",
    },
    SWEDISH: {
      en: "Swedish",
    },
    SWISS: {
      en: "Swiss",
    },
    SYRIAN: {
      en: "Syrian",
    },
    TAIWANESE: {
      en: "Taiwanese",
    },
    TAJIK: {
      en: "Tajik",
    },
    TANZANIAN: {
      en: "Tanzanian",
    },
    THAI: {
      en: "Thai",
    },
    TOGOLESE: {
      en: "Togolese",
    },
    TONGAN: {
      en: "Tongan",
    },
    TRINIDADIAN: {
      en: "Trinidadian",
    },
    TRISTANIAN: {
      en: "Tristanian",
    },
    TUNISIAN: {
      en: "Tunisian",
    },
    TURKISH: {
      en: "Turkish",
    },
    TURKMEN: {
      en: "Turkmen",
    },
    TURKS_AND_CAICOS_ISLANDER: {
      en: "Turks and Caicos Islander",
    },
    TUVALUAN: {
      en: "Tuvaluan",
    },
    UGANDAN: {
      en: "Ugandan",
    },
    UKRAINIAN: {
      en: "Ukrainian",
    },
    URUGUAYAN: {
      en: "Uruguayan",
    },
    UZBEK: {
      en: "Uzbek",
    },
    VATICAN_CITIZEN: {
      en: "Vatican citizen",
    },
    VENEZUELAN: {
      en: "Venezuelan",
    },
    VIETNAMESE: {
      en: "Vietnamese",
    },
    VINCENTIAN: {
      en: "Vincentian",
    },
    WALLISIAN: {
      en: "Wallisian",
    },
    WELSH: {
      en: "Welsh",
    },
    YEMENI: {
      en: "Yemeni",
    },
    ZAMBIAN: {
      en: "Zambian",
    },
    ZIMBABWEAN: {
      en: "Zimbabwean",
    },
  }
};

function getEnumString(name, value) {
  const locale = CookieManager.get("locale");
  if (
    enums[name] !== undefined &&
    enums[name][value] !== undefined &&
    enums[name][value][locale] !== undefined
  ) {
    return enums[name][value][locale];
  }
  else {
    return value;
  }
}
