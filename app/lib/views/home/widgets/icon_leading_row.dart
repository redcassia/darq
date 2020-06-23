import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/elements/app_fonts.dart';

class IconLeadingRow extends StatelessWidget {
  const IconLeadingRow(
      {Key key, @required this.imgName, @required this.txt, this.textStyle})
      : super(key: key);

  final String imgName;
  final String txt;
  final TextStyle textStyle;
  @override
  Widget build(BuildContext context) {
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: <Widget>[
      Image(image: AssetImage(PathFiles.ImgPath + imgName)),
      SizedBox(width: 4.5.w),
      Expanded(
          child: Text(txt,
              style: textStyle ??
                  AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5))))
    ]);
  }
}
