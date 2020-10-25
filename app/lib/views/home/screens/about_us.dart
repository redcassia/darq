import 'dart:ui';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class AboutUs extends StatefulWidget {
  @override
  _AboutUsState createState() => _AboutUsState();
}

class _AboutUsState extends State<AboutUs> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        extendBodyBehindAppBar: false,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.h),
            child: Container(
                decoration: BoxDecoration(
                    color: Color(0xFF86C2C2),
                    borderRadius: Localizations.localeOf(context)
                                .languageCode ==
                            'en'
                        ? BorderRadius.only(
                            bottomRight: Radius.circular(45),
                          )
                        : BorderRadius.only(bottomLeft: Radius.circular(45))),
                padding: EdgeInsets.only(top: 33.h, bottom: 22.h),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      BackArrow(
                          backArrowBgColor:
                              Color.fromRGBO(134, 194, 194, 0.69)),
                      Image(
                          image:
                              AssetImage(PathFiles.ImgPath + "logo_notxt.png")),
                      Visibility(
                          maintainInteractivity: false,
                          maintainSize: true,
                          maintainAnimation: true,
                          maintainState: true,
                          visible: false,
                          child: BackArrow(
                              backArrowBgColor:
                                  Color.fromRGBO(134, 194, 194, 0.69)))
                    ]))),
        body: SingleChildScrollView(
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 20.h, horizontal: 20.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(translate("about_us"),
                        style: AppFonts.text4w700(color: Color(0xFF476C7B))),
                    SizedBox(height: 26.h),
                    Text(translate("about_us_txt"),
                        style: AppFonts.text6w500(color: Color(0xFF476C7B))),
                    SizedBox(height: 15.h),
                    Center(
                        child: Text(translate("welcome_to_darq"),
                            style:
                                AppFonts.text5w500(color: Color(0xFF476C7B))))
                  ],
                ))));
  }
}
