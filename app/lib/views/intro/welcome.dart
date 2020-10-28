import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/home/screens/home.dart';
import 'package:darq/views/intro/select_language.dart';
import 'package:darq/views/shared/button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Welcome extends StatelessWidget {
  Future hasLocale(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('locale');
  }

  @override
  Widget build(BuildContext context) {
    ScreenUtil.init(context,
        designSize: Size(375, 667));
    SI.setScreenDimensions(
        MediaQuery.of(context).size.width, MediaQuery.of(context).size.height);
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        body: Center(
            child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 67.w),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(translate("welcome"),
                          style: AppFonts.superTitle(color: Colors.white)),
                      SizedBox(height: 31.h),
                      RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                              style: AppFonts.title4(color: Colors.white),
                              children: <TextSpan>[
                                TextSpan(
                                    text: translate("see_what_is_happening")),
                                TextSpan(
                                    text: translate("qatar"),
                                    style: TextStyle(color: Color(0xFF426676))),
                                TextSpan(text: translate("right_now"))
                              ])),
                      SizedBox(height: 33.h),
                      CustomButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7Odd(color: Colors.white),
                          height: 46.h,
                          width: 109.w,
                          buttonName: translate("continue_button"),
                          color: Color(0xFFE1A854),
                          onButtonPressed: () => hasLocale(context).then((_) {
                            if (_)
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => Home()));
                            else
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          SelectLanguage()));
                          }))
                    ]))));
  }
}
