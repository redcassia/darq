
class Locale {

  static apply(data, locale) {

    if (data[locale] !== undefined) {
      return data[locale];
    }
    else {
      for (var key in data) {
        if (data[key] instanceof Object) {
          data[key] = this.apply(data[key], locale);
        }
        else if (data[key] instanceof Array) {
          data[key] = data[key].map(_ => this.apply(_, locale));
        }
      }
      return data;
    }
  }
}

Locale.strings = {
  sub_type_string: {
    SelfEmployedBusiness: {
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
    ChildEducationBusiness: {
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
    DomesticHelpBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر",
      }
    },
    BeautyBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر",
      }
    },
    TransportationBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر",
      }
    },
    HospitalityBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر",
      }
    },
    MadeInQatarBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر",
      }
    },
    SportsBusiness: {
      GYM: {
        en: "Gym",
        ar: "صالون رياضي",
      },
      CLUB: {
        en: "Club",
        ar: "نادي رياضي",
      }
    },
    EntertainmentBusiness: {
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
    FoodBusiness: {
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
    CleaningAndMaintenanceBusiness: {
      OTHER: {
        en: "Other",
        ar: "آخر"
      }
    }
  }
}

module.exports = Locale;
