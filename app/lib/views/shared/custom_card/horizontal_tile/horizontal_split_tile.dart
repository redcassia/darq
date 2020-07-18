import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HorizontalSplitTile extends StatelessWidget {
  const HorizontalSplitTile({
    Key key,
    @required this.leftWidget,
    @required this.rightWidget,
  }) : super(key: key);

  final Widget leftWidget;
  final Widget rightWidget;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20), bottomRight: Radius.circular(20)),
        child: IntrinsicHeight(
            child: Container(
                width: double.infinity,
                margin:
                    EdgeInsets.only(bottom: 20.0, right: 6, left: 6, top: 1),
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
                      bottomRight: Radius.circular(20),
                    )),
                child: Padding(
                    padding: EdgeInsets.only(
                        left: 11.w, right: 18.w, top: 9.h, bottom: 7.h),
                    child: Row(children: <Widget>[
                      leftWidget,
                      SizedBox(width: 17.w),
                      rightWidget
                    ])))));
  }
}
