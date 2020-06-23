import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';

class RightRoundedCapsule extends StatelessWidget {
  const RightRoundedCapsule(
      {Key key,
      @required this.verticalPadding,
      @required this.horizontalPadding,
      this.title,
      this.icon,
      @required this.iconColor})
      : super(key: key);

  final double verticalPadding;
  final double horizontalPadding;
  final String title;
  final Widget icon;
  final Color iconColor;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
          topRight: Radius.circular(45.0), bottomRight: Radius.circular(45.0)),
      child: Container(
          margin: EdgeInsets.only(bottom: 6.0, top: 1, right: 6),
          decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                    color: Color.fromRGBO(0, 0, 0, 0.25),
                    blurRadius: 6.0,
                    offset: Offset(0.0, 0.5))
              ],
              color: iconColor,
              borderRadius: BorderRadius.only(
                  topRight: Radius.circular(45.0),
                  bottomRight: Radius.circular(45.0))),
          child: Padding(
              padding: EdgeInsets.symmetric(
                  vertical: verticalPadding, horizontal: horizontalPadding),
              child: icon ??
                  Text(title, style: AppFonts.title8(color: Colors.white)))),
    );
  }
}
