import 'package:darq/utils/services/local_storage_auth_service.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:intl/intl.dart';

class LocaleStorageTimeService {
  static String formatInt(int val) {
    LocaleStorageAuthService.getLocale.then((locale) {
      if (locale == 'ar') return NumberFormat("", "ar_EG").format(val);
    });
    return val.toString();
  }

  static String formatDateTime(String val) {
    LocaleStorageAuthService.getLocale.then((locale) {
      return DateFormat("dd / MM / y  \u2014  hh:mm a",
              locale == "en" ? 'en_US' : 'ar_EG')
          .format(DateTime.parse(val).toLocal());
    });
    return val;
  }

  static String formatDate(String val) {
    LocaleStorageAuthService.getLocale.then((locale) {
      return DateFormat("dd / MM / y", locale == "en" ? 'en_US' : 'ar_EG')
          .format(DateTime.parse(val).toLocal());
    });
    return val;
  }

  static String formatTime(String val) {
    LocaleStorageAuthService.getLocale.then((locale) {
      return DateFormat("hh:mm a", locale == "en" ? 'en_US' : 'ar_EG')
          .format(DateTime.parse(val).toLocal());
    });
    return val;
  }

  static String formatDateTimeMessages(DateTime dateTime,
      {bool fullDate = false}) {
    DateTime now = DateTime.now();
    DateTime currentDate = DateTime(now.year, now.month, now.day);
    LocaleStorageAuthService.getLocale.then((locale) {
      if (fullDate)
        return DateFormat("dd / MM / y  \u2014  hh:mm a",
                locale == "en" ? 'en_US' : 'ar_EG')
            .format(dateTime.toLocal());
      if (currentDate.year > dateTime.year ||
          (currentDate.year == dateTime.year &&
              currentDate.day - 1 > dateTime.day))
        return DateFormat("dd / MM / y", locale == "en" ? 'en_US' : 'ar_EG')
            .format(dateTime.toLocal());
      if (currentDate.year == dateTime.year &&
          currentDate.day - 1 == dateTime.day) return translate("yesterday");

      if (currentDate.year == dateTime.year && currentDate.day == dateTime.day)
        return DateFormat("hh:mm a", locale == "en" ? 'en_US' : 'ar_EG')
            .format(dateTime.toLocal());
    });

    return "";
  }
}
