import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/views/walk_through/landing_page.dart';
import 'package:darq/utils/managers/walk_through_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:flutter_translate_preferences/flutter_translate_preferences.dart';
import 'package:provider/provider.dart';

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
    return LocalizationProvider(
        state: LocalizationProvider.of(context).state,
        child: ScreenUtilInit(
            designSize: Size(375, 812),
            allowFontScaling: true,
            builder: () => MultiProvider(
                    providers: [
                      ChangeNotifierProvider<SelectLangWidgetsProvider>(
                          create: (_) => SelectLangWidgetsProvider()),
                      ChangeNotifierProvider<AuthStateProvider>(
                          create: (_) => AuthStateProvider()),
                      ChangeNotifierProvider<FlipProvider>(
                          create: (_) => FlipProvider())
                    ],
                    child: MaterialApp(
                        theme: ThemeData(
                            scaffoldBackgroundColor: Color(AppColors.white)),
                        debugShowCheckedModeBanner: false,
                        title: 'DarQ',
                        home: LandingPage(),
                        localizationsDelegates: [
                          GlobalMaterialLocalizations.delegate,
                          GlobalWidgetsLocalizations.delegate,
                          GlobalCupertinoLocalizations.delegate,
                          localizationDelegate
                        ],
                        supportedLocales: localizationDelegate.supportedLocales,
                        locale: localizationDelegate.currentLocale))));
  }
}
