import 'dart:ui';

import 'package:darq/constants/app_color_palette.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DefaultCard extends StatelessWidget {
  const DefaultCard(
      {Key key, this.color, @required this.child, this.margin})
      : super(key: key);

  final Widget child;
  final EdgeInsets margin;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        margin: margin,
        decoration: BoxDecoration(
            color: Color(AppColors.alabaster),
            borderRadius: BorderRadius.circular(10.w)),
        child: Padding(
            padding:
                EdgeInsets.only(left: 13.w, right: 28.w, top: 9.w, bottom: 8.h),
            child: child));
  }
}
