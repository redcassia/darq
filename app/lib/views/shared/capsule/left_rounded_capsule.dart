import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';

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
    return Container(
        decoration: BoxDecoration(
            color: Color.fromRGBO(134, 194, 194, 0.69),
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(45.0),
                bottomLeft: Radius.circular(45.0))),
        child: Padding(
            padding: EdgeInsets.symmetric(
                vertical: verticalPadding, horizontal: horizontalPadding),
            child: icon ??
                Text(title, style: AppFonts.title8(color: Colors.white))));
  }
}
