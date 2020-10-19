import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future setLocale(String locale, BuildContext context) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  await prefs.setString('locale', locale);
}

Future hasLocale(BuildContext context) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.containsKey('locale');
}
