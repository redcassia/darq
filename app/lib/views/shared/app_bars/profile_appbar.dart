import 'dart:ui';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ProfileAppBar extends StatelessWidget {
  const ProfileAppBar(
      {Key key,
      this.backArrowBgColor,
      this.filterIndicator,
      this.buttonName,
      this.filterFunction})
      : super(key: key);

  final Color backArrowBgColor;
  final bool filterIndicator;
  final String buttonName;
  final Function() filterFunction;

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding:
            EdgeInsets.only(right: filterIndicator ? 0.w : 14.w, top: 35.h),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              InkWell(
                child: RightRoundedCapsule(
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    iconBgColor: backArrowBgColor ?? Color(0xFF426676),
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                onTap: () => Navigator.pop(context),
              ),
              Row(children: <Widget>[
                CustomButton(
                    height: 23.h,
                    width: 93.w,
                    buttonName: buttonName,
                    color: Color(0xFFE1A854),
                    borderRadius: 27,
                    textStyle: AppFonts.title11Odd(color: Colors.white),
                    onButtonPressed: () => {}),
                filterIndicator
                    ? InkWell(
                        onTap: () => filterFunction(),
                        child: LeftRoundedCapsule(
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
