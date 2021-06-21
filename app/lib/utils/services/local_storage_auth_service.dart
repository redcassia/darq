import 'package:shared_preferences/shared_preferences.dart';

class LocaleStorageAuthService {
  static Future<void> setLocale(String locale) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('locale', locale);
  }

  static Future<String> get getLocale async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('locale');
  }

  static Future<void> setToken(String token) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('token', token);
  }

  static Future<String> get getToken async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<void> setId(String id) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.setString('id', id);
  }

  static Future<String> get getId async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('id');
  }
}

