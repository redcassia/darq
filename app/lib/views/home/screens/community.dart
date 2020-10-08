import 'dart:ui';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/screens/listing_page.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/rounded_capsule.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class Community extends StatefulWidget {
  @override
  _CommunityState createState() => _CommunityState();
}

class _CommunityState extends State<Community> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: translate("community"),
                bgImage: Localizations.localeOf(context).languageCode == 'en'
                    ? "rounded_app_bar.png"
                    : "rounded_app_bar_left.png",
                leading: BackArrow(),
                onLeadingClicked: () => Navigator.pop(context))),
        body: SingleChildScrollView(
            child: Center(
          child: Padding(
              padding: EdgeInsets.only(top: 154.h, bottom: 10.h),
              child: Wrap(runSpacing: 20.h, children: <Widget>[
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("beauty_spa"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "beauty_spa.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "beauty_spa.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("sports"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "sports.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "sports.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("limousine"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "limousine.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "limousine.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("hospitality"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "hospitality.png",
                    onButtonPressed: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (context) {
                        return ListingPage(jsonFile: "hospitality.json");
                      }));
                    },
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("cleaning_maintenance"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "cleaning_maintenance.png",
                    onButtonPressed: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (context) {
                        return ListingPage(
                            jsonFile: "cleaning_maintenance.json");
                      }));
                    },
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("self_employed"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "self_employed.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "self_employed.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("domestic_help"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "domestic_help.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "domestic_help.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676))),
                CustomButton(
                    borderRadius: 29.5,
                    buttonName: translate("stationeries"),
                    width: 229.w,
                    color: Color(0xFF86C2C2),
                    height: 55.h,
                    leading: "stationeries.png",
                    onButtonPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ListingPage(jsonFile: "stationeries.json");
                        })),
                    textStyle: AppFonts.title9(color: Color(0xFF426676)))
              ])),
        )));
  }
}
