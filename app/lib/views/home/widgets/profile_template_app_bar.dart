import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/widgets/profile_template.dart';

class ProfileTemplateAppBar extends StatelessWidget {
  const ProfileTemplateAppBar({
    Key key,
    @required this.widget,
  }) : super(key: key);

  final ProfileTemplate widget;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
      EdgeInsets.only(right: widget.title == "Domestic Help" ? 0 : 14.w, top: 40.h),
      child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            RightRoundedCapsule(
                verticalPadding: 5.h,
                horizontalPadding: 19.w,
                iconColor: Color(0xFF426676),
                icon: Image(
                    width: 9.73.w,
                    fit: BoxFit.fill,
                    image: AssetImage(PathFiles.ImgPath + "back.png"))),
            Row(children: <Widget>[
              CustomButton(
                  height: 23.h,
                  width: 93.w,
                  buttonName: widget.title == "Self Employed"
                      ? "Contact Me"
                      : "Contact Us",
                  color: Color(0xFFE1A854),
                  borderRadius: 27,
                  textStyle: AppFonts.title10Odd(color: Colors.white),
                  onButtonPressed: () => {}),
              widget.title == "Domestic Help"
                  ? LeftRoundedCapsule(
                      horizontalPadding: 16.w,
                      verticalPadding: 5.h,
                      icon: Image(
                          fit: BoxFit.fitHeight,
                          width: 18.w,
                          image: AssetImage(PathFiles.ImgPath + "filter.png")))
                  : Container()
            ])
          ]),
    );
  }
}
