import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/constants.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/app_bars/back_arrow.dart';
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
        extendBodyBehindAppBar: false,
        appBar:  PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                title: translate("about_app")
            )),
        body: SingleChildScrollView(
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 20.h, horizontal: 20.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(child: Image(image: AssetImage(AssetPath.ImgPath+ "about_app.png"))),
                    SizedBox(height: 26.h),
                    Text(translate("about_us_txt"),
                        style: AppFonts.text7(color: Color(0xFF263A48),fontWeight: FontWeight.w500)),
                    SizedBox(height: 15.h),
                    Center(
                        child: Text(translate("welcome_to_darq"),
                            style: AppFonts.text5(color: Color(0xFF476C7B))))
                  ],
                ))));
  }
}
