import 'dart:ui';

import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TextLeadingRow extends StatelessWidget {
  const TextLeadingRow(
      {Key key,
      @required this.title,
      @required this.txt,
      this.titleStyle,
      this.txtStyle,
      this.widget})
      : super(key: key);

  final String title;
  final String txt;
  final TextStyle titleStyle;
  final TextStyle txtStyle;
  final Widget widget;
  @override
  Widget build(BuildContext context) {
    return Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: <Widget>[
          Text(title, style: titleStyle),
          SizedBox(width: 6.w),
          widget ?? Text(txt, style: txtStyle)
        ]);
  }
}

class IconLeadingRow extends StatelessWidget {
  const IconLeadingRow(
      {Key key, @required this.iconName, @required this.txt, this.textStyle})
      : super(key: key);

  final String iconName;
  final String txt;
  final TextStyle textStyle;
  @override
  Widget build(BuildContext context) {
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: <Widget>[
      RotatedBox(
          quarterTurns: Localizations.localeOf(context).languageCode == 'en'
              ? 0
              : iconName == "telephone.png" ? 3 : 0,
          child: Image(
              width: 13.w,
              height: 13.w,
              fit: BoxFit.fill,
              image: AssetImage(PathFiles.ImgPath + iconName))),
      SizedBox(width: 4.5.w),
      Text(txt, style: textStyle, maxLines: 2,overflow: TextOverflow.ellipsis,)
    ]);
  }
}
