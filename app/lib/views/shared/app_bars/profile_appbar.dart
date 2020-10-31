import 'dart:ui';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/home/screens/chat_room.dart';
import 'package:darq/views/home/screens/rating_screen.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/rounded_capsule.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class ProfileAppBar extends StatelessWidget {
  const ProfileAppBar(
      {Key key,
      this.backArrowBgColor,
      this.filterIndicator,
      this.buttonName,
      this.filterFunction,
      this.rateButton = true,
      this.id})
      : super(key: key);

  final dynamic id;
  final Color backArrowBgColor;
  final bool filterIndicator;
  final String buttonName;
  final Function() filterFunction;
  final bool rateButton;

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: Localizations.localeOf(context).languageCode == 'en'
            ? EdgeInsets.only(right: filterIndicator ? 0.w : 14.w, top: 35.h)
            : EdgeInsets.only(left: filterIndicator ? 0.w : 14.w, top: 35.h),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              BackArrow(backArrowBgColor: backArrowBgColor),
              Row(children: <Widget>[
                CustomButton(
                    height: 23.h,
                    width: 93.w,
                    buttonName: buttonName,
                    color: Color(0xFFE1A854),
                    borderRadius: 27,
                    textStyle: AppFonts.title11Odd(color: Colors.white),
                    onButtonPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => ChatRoom(businessId: id)))),
                rateButton? CustomButton(
                    height: 23.h,
                    width: 93.w,
                    buttonName: translate("rate"),
                    color: Color(0xFFE1A854),
                    borderRadius: 27,
                    textStyle: AppFonts.title11Odd(color: Colors.white),
                    onButtonPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                RatingScreen(businessId: id)))) : Container(),
                filterIndicator
                    ? InkWell(
                        onTap: () => filterFunction(),
                        child: RoundedCapsule(
                            Localizations.localeOf(context).languageCode == 'en'
                                ? "left"
                                : "right",
                            horizontalPadding: 16.w,
                            verticalPadding: 5.h,
                            icon: Image(
                                fit: BoxFit.fitHeight,
                                width: 18.w,
                                image: AssetImage(
                                    PathFiles.ImgPath + "filter.png"))),
                      )
                    : Container(height: 0.h)
              ])
            ]));
  }
}
