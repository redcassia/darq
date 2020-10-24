import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/home/screens/home.dart';
import 'package:darq/views/shared/button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class SelectLanguage extends StatelessWidget {
  final ImageProvider bg =
      AssetImage(PathFiles.ImgPath + "select_language_bg.png");
  @override
  Widget build(BuildContext context) {
    ScreenUtil.init(context, width: 375, height: 667, allowFontScaling: true);
    return Scaffold(
        body: Container(
            decoration: BoxDecoration(
                image: DecorationImage(image: bg, fit: BoxFit.cover)),
            child: Center(
                child: Column(children: <Widget>[
              SizedBox(height: 131.h),
              Image(
                  image: AssetImage(PathFiles.ImgPath + "logo.png"),
                  width: 92.w,
                  fit: BoxFit.fitHeight),
              SizedBox(height: 33.h),
              CustomButton(
                  borderRadius: 34.1,
                  textStyle: AppFonts.title7Odd(color: Colors.white),
                  height: 46.h,
                  width: 109.w,
                  buttonName: "English",
                  color: Color(0xFF426676),
                  onButtonPressed: () {
                    changeLocale(context, 'en_US');
                    Session.setLocale("en");
                    Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Home()));
                  }),
              SizedBox(height: 11.h),
              CustomButton(
                  borderRadius: 34.1,
                  textStyle: AppFonts.title7Odd(color: Colors.white),
                  height: 46.h,
                  width: 109.w,
                  buttonName: "العربية",
                  color: Color(0xFFE1A854),
                  onButtonPressed: () {
                    changeLocale(context, 'ar');
                    Session.setLocale("ar");
                    Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Home()));
                  }),
            ]))));
  }
}
