import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/intro/select_language.dart';

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
                      Text("Welcome",
                          style: AppFonts.superTitle(color: Colors.white)),
                      SizedBox(height: 31.h),
                      RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                              style: AppFonts.title4(color: Colors.white),
                              children: <TextSpan>[
                                TextSpan(text: "see what\'s happeing in "),
                                TextSpan(
                                    text: 'Qatar',
                                    style: TextStyle(color: Color(0xFF426676))),
                                TextSpan(text: " right now")
                              ])),
                      SizedBox(height: 33.h),
                      CustomButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7Odd(color: Colors.white),
                          height: 46.h,
                          width: 109.w,
                          buttonName: "Continue",
                          color: Color(0xFFE1A854),
                          onButtonPressed: () => Navigator.push(context,
                                  MaterialPageRoute(builder: (context) {
                                return SelectLanguage();
                              })))
                    ]))));
  }
}
