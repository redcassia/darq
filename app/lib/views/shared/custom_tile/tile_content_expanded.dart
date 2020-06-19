import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/elements/app_fonts.dart';


class TileContentExpanded extends StatelessWidget {
  const TileContentExpanded(
      {Key key,
        @required this.title,
        this.subTitle,
        this.descriptionWidget,
        this.onButtonClicked,
        this.buttonName,
        this.description})
      : super(key: key);

  final String title;
  final String subTitle;
  final Widget descriptionWidget;
  final String buttonName;
  final Function(bool) onButtonClicked;
  final String description;
  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: <
        Widget>[
      Text(title, style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.7))),
      subTitle != null
          ? Text(subTitle,
          style: AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5)))
          : Container(),
      SizedBox(height: 3.h),
      Flexible(
          child: descriptionWidget ??
              Text(description,
                  maxLines: 3,
                  style: AppFonts.text9(color: Color.fromRGBO(0, 0, 0, 0.37)))),
      SizedBox(height: 2.h),
      Text("View Details..",
          style: AppFonts.title10Odd(color: Color(0xFFE1A854))),
      SizedBox(height: 10.h),
      Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: buttonName,
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title10Odd(color: Colors.white),
            onButtonPressed: () => onButtonClicked(true))
      ])
    ]);
  }
}
