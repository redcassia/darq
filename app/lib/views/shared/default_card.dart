import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DefaultCard extends StatelessWidget {
  const DefaultCard(
      {Key key, this.color, @required this.child, this.margin, this.padding})
      : super(key: key);

  final Widget child;
  final EdgeInsets margin;
  final EdgeInsets padding;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: Localizations.localeOf(context).languageCode == 'en'
            ? BorderRadius.only(
                topLeft: Radius.circular(20.w), bottomRight: Radius.circular(20.w))
            : BorderRadius.only(
                topRight: Radius.circular(20.w), bottomLeft: Radius.circular(20.w)),
        child: Container(
            width: double.infinity,
            margin: margin,
            decoration: BoxDecoration(
                color: color ?? Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.37),
                      blurRadius: 5.0,
                      offset: Offset(1, 1))
                ],
                borderRadius:
                    Localizations.localeOf(context).languageCode == 'en'
                        ? BorderRadius.only(
                            topLeft: Radius.circular(20.w),
                            bottomRight: Radius.circular(20.w))
                        : BorderRadius.only(
                            topRight: Radius.circular(20.w),
                            bottomLeft: Radius.circular(20.w))),
            child: Padding(padding: padding, child: child)));
  }
}
