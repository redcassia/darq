import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
class CustomChip extends StatelessWidget {
  const CustomChip({
    Key key,
    this.text,
  }) : super(key: key);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: EdgeInsets.only(bottom: 6.0, top: 1),
        decoration: BoxDecoration(
            color: Color.fromRGBO(158, 202, 202, 0.5),
            borderRadius:  BorderRadius.all(Radius.circular(17.6))),
        child: Padding(
            padding: EdgeInsets.symmetric(
                vertical: 4.h, horizontal: 9.6.w),
            child:
                Text(text, style: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)))));
  }
}
