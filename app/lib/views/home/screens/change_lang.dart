import 'dart:ui';

import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/shared_prefs_locale.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class ChangeLang extends StatefulWidget {
  @override
  _ChangeLangState createState() => _ChangeLangState();
}

class _ChangeLangState extends State<ChangeLang> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                bgImage: "app_bar_rectangle.png",
                leading: BackArrow(),
                onLeadingClicked: () => Navigator.pop(context))),
        body: DefaultCard(
            margin: EdgeInsets.only(
                right: 20.w, left: 20.w, bottom: 10.h, top: 10.h),
            padding: EdgeInsets.zero,
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 30.h),
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(translate("change_lang_text"),
                          style: AppFonts.title7(
                              color: Color.fromRGBO(0, 0, 0, 0.7))),
                      SizedBox(height: 20.h),
                      Image(
                          fit: BoxFit.fitHeight,
                          width: 250.w,
                          height: 140.h,
                          image: AssetImage(
                              PathFiles.ImgPath + "choose_lang_img.png")),
                      SizedBox(height: 30.h),
                      CustomButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7Odd(color: Colors.white),
                          height: 46.h,
                          width: 109.w,
                          buttonName: "English",
                          color: Color(0xFF426676),
                          onButtonPressed: () {
                            changeLocale(context, 'en_US');
                            Session.setLocale('en');
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
                            Session.setLocale('ar');
                          })
                    ]))));
  }
}
