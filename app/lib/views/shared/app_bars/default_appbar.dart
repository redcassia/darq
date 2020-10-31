import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/rounded_capsule.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DefaultAppBar extends StatelessWidget {
  const DefaultAppBar(
      {@required this.bgImage,
      @required this.title,
      this.onLeadingClicked,
      this.leading,
      this.trailing,
      this.allowHorizontalPadding,
      this.bgColor,
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

  final Color bgColor;

  ///on left icon clicked [Function]
  final Function onLeadingClicked;

  /// Allow horizontal padding within edges of [leading] and [trailing].. by default it's set to false
  final bool allowHorizontalPadding;

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            color: bgColor ?? Colors.transparent,
            image: DecorationImage(
                image: AssetImage(PathFiles.ImgPath + bgImage),
                fit: BoxFit.fill)),
        child: Padding(
            padding: EdgeInsets.only(bottom: 6.h, top: 35.h),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Padding(
                      padding: EdgeInsets.only(
                          left: allowHorizontalPadding ? 20.w : 0,
                          right: allowHorizontalPadding ? 20.w : 0,
                          bottom: 17.h),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            GestureDetector(
                                child: leading,
                                onTap: () => onLeadingClicked()),
                            trailing ?? Container(height: 0),
                          ])),
                  title != null
                      ? RoundedCapsule(
                          Localizations.localeOf(context).languageCode == 'en'
                              ? "right"
                              : "left",
                          iconBgColor: Color.fromRGBO(134, 194, 194, 0.69),
                          horizontalPadding: 19.w,
                          verticalPadding: 4.h,
                          title: title)
                      : Container()
                ])));
  }
}
