import 'package:darq/res/path_files.dart';
import 'package:darq/views/intro/welcome.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_translate_preferences/flutter_translate_preferences.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  LocalizationDelegate.create(
      preferences: TranslatePreferences(),
      fallbackLocale: 'en_US',
      supportedLocales: ['en_US', 'ar']).then((delegate) {
    SystemChrome.setPreferredOrientations(
            [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown])
        .then((_) => runApp(LocalizedApp(delegate, MyApp())));
  });
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    LocalizationDelegate localizationDelegate =
        LocalizedApp.of(context).delegate;
    precacheImage(
        AssetImage(PathFiles.ImgPath + "select_language_bg.png"), context);
    return LocalizationProvider(
        state: LocalizationProvider.of(context).state,
        child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'DarQ',
            home: Welcome(),
            localizationsDelegates: [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
              localizationDelegate
            ],
            supportedLocales: localizationDelegate.supportedLocales,
            locale: localizationDelegate.currentLocale));
  }
}
