import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/utilities/constants.dart';

class LeftRoundedCapsule extends StatelessWidget {
  const LeftRoundedCapsule(
      {Key key,
      @required this.verticalPadding,
      @required this.horizontalPadding,
      this.title,
      this.icon})
      : super(key: key);

  final double verticalPadding;
  final double horizontalPadding;
  final String title;
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
          topLeft: Radius.circular(ConsDimensions.CapsuleRadius),
          bottomLeft: Radius.circular(ConsDimensions.CapsuleRadius)
      ),
      child: Container(
          margin: EdgeInsets.only(bottom:ConsDimensions.CapsuleBottomShadow.h, top: ConsDimensions.CapsuleUpperShadow.h, left: ConsDimensions.CapsuleHorizontalShadow.w),
          decoration: BoxDecoration(
              boxShadow: ConsDimensions.CapsuleBoxShadow,
              color: Color.fromRGBO(134, 194, 194, 0.69),
              borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(ConsDimensions.CapsuleRadius),
                  bottomLeft: Radius.circular(ConsDimensions.CapsuleRadius))),
          child: Padding(
              padding: EdgeInsets.symmetric(
                  vertical: verticalPadding, horizontal: horizontalPadding),
              child: icon ??
                  Text(title, style: AppFonts.title8(color: Colors.white)))),
    );
  }
}
