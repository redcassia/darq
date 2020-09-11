import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class RightRoundedCapsule extends StatelessWidget {
  const RightRoundedCapsule(
      {Key key,
      @required this.verticalPadding,
      @required this.horizontalPadding,
      this.title,
      this.icon,
      @required this.iconBgColor})
      : super(key: key);

  final double verticalPadding;
  final double horizontalPadding;
  final String title;
  final Widget icon;
  final Color iconBgColor;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
          topRight: Radius.circular(ConsDimensions.CapsuleRadius),
          bottomRight: Radius.circular(ConsDimensions.CapsuleRadius)),
      child: Container(
          margin: EdgeInsets.only(
              bottom: ConsDimensions.CapsuleBottomShadow.h,
              top: ConsDimensions.CapsuleUpperShadow.h,
              right: ConsDimensions.CapsuleHorizontalShadow.w),
          decoration: BoxDecoration(
              boxShadow: ConsDimensions.CapsuleBoxShadow,
              color: iconBgColor,
              borderRadius: BorderRadius.only(
                  topRight: Radius.circular(ConsDimensions.CapsuleRadius),
                  bottomRight: Radius.circular(ConsDimensions.CapsuleRadius))),
          child: Padding(
              padding: EdgeInsets.symmetric(
                  vertical: verticalPadding, horizontal: horizontalPadding),
              child: icon ??
                  Text(title, style: AppFonts.title8(color: Colors.white)))),
    );
  }
}
