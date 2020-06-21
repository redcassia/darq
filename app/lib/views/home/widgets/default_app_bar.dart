import 'dart:ui';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';

class CommunityChildrenAppBar extends StatelessWidget {
  const CommunityChildrenAppBar({Key key, @required this.title, @required this.trailing})
      : super(key: key);

  final String title;
  final bool trailing;
  @override
  Widget build(BuildContext context) {
    return DefaultAppBar(
        allowHorizontalPadding: false,
        title: title,
        bgImage: "app_bar_rectangle.png",
        leading: RightRoundedCapsule(
            verticalPadding: 5.h,
            horizontalPadding: 19.w,
            icon: Image(
                width: 9.73.w,
                fit: BoxFit.fill,
                image: AssetImage(PathFiles.ImgPath + "back.png"))),
        trailing: trailing
            ? LeftRoundedCapsule(
                horizontalPadding: 16.w,
                verticalPadding: 5.h,
                icon: Image(
                    fit: BoxFit.fitHeight,
                    width: 18.w,
                    image: AssetImage(PathFiles.ImgPath + "filter.png")))
            : null,
        onLeadingClicked: () => Navigator.pop(context));
  }
}
