import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/intro/select_language.dart';
import 'package:darq/views/shared/button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class Welcome extends StatefulWidget {
  @override
  _WelcomeState createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {
  @override
  Widget build(BuildContext context) {
    ScreenUtil.init(context, width: 375, height: 667, allowFontScaling: true);
    SI.setScreenDimensions(
        MediaQuery.of(context).size.width, MediaQuery.of(context).size.height);

    return Scaffold(
        // TODO: Turn colors into names ...
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
                                    text: translate(
                                        "see_what_is_happening")),
                                TextSpan(
                                    text: translate(
                                        "qatar"),
                                    style: TextStyle(color: Color(0xFF426676))),
                                TextSpan(
                                    text: translate(
                                        "right_now"))
                              ])),
                      SizedBox(height: 33.h),
                      CustomButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7Odd(color: Colors.white),
                          height: 46.h,
                          width: 109.w,
                          buttonName: translate("continue_button"),
                          color: Color(0xFFE1A854),
                          onButtonPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => SelectLanguage())))
                    ]))));
  }
}
