import 'package:flutter/material.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';

class DefaultAppBar extends StatelessWidget {
  const DefaultAppBar(
      {@required this.bgImage,
      @required this.title,
      this.onLeadingClicked,
      this.leading,
      this.trailing,
      this.allowHorizontalPadding,
      Key key})
      : super(key: key);

  ///app bar background image of type [String] ... it fills the whole area
  final String bgImage;

  ///app bar title of type [String]
  final String title;

  ///right icon of type [Widget]
  final Widget trailing;

  ///left icon of type [Widget]
  final Widget leading;

  ///on left icon clicked [Function]
  final Function onLeadingClicked;

  /// Allow horizontal padding within edges of [leading] and [trailing].. by default it's set to false
  final bool allowHorizontalPadding;

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage(PathFiles.ImgPath + bgImage),
                fit: BoxFit.fill)),
        child: Padding(
            padding: EdgeInsets.only(bottom: 16.h, top: 38.h),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Padding(
                      padding: EdgeInsets.only(
                          left: allowHorizontalPadding ? 22.w : 0,
                          right: allowHorizontalPadding ? 18.w : 0,
                          bottom: 18.65.h),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            GestureDetector(
                                child: leading,
                                onTap: () => onLeadingClicked()),
                            trailing ?? Container()
                          ])),
                  RightRoundedCapsule(
                      horizontalPadding: 19.w,
                      verticalPadding: 4.h,
                      title: title)
                ])));
  }
}
