import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DefaultTile extends StatelessWidget {
  const DefaultTile({Key key, @required this.child}) : super(key: key);

  final Widget child;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20), bottomRight: Radius.circular(20)),
        child: Container(
            width: double.infinity,
            margin: EdgeInsets.only(
                bottom: 33.h, right: 19.w, left: 20.w, top: 6.h),
            decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.37),
                      blurRadius: 5.0,
                      offset: Offset(1, 1))
                ],
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20))),
            child: Padding(
                padding: EdgeInsets.only(
                    left: 21.w, right: 19.w, top: 12.h, bottom: 17.h),
                child: child)));
  }
}
