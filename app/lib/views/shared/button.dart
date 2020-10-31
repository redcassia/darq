import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomButton extends StatelessWidget {
  const CustomButton(
      {@required this.buttonName,
      this.color,
      this.onButtonPressed,
      this.width,
      this.height,
      this.textStyle,
      this.leading,
      this.borderRadius,
      Key key})
      : super(key: key);

  final String buttonName;
  final Color color;
  final Function onButtonPressed;
  final double height;
  final double width;
  final TextStyle textStyle;
  final String leading;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: () => onButtonPressed(),
        child: CustomClipRRect(
            borderRadius: borderRadius,
            height: height,
            width: width,
            color: color,
            widget: Padding(
                padding: leading == null
                    ? EdgeInsets.symmetric(horizontal: 15.w)
                    : EdgeInsets.only(
                        left:
                            Localizations.localeOf(context).languageCode == 'en'
                                ? 34.w
                                : 0,
                        right:
                            Localizations.localeOf(context).languageCode == 'en'
                                ? 0
                                : 34.w),
                child: leading == null
                    ? Center(
                        child: Text(buttonName,
                            style: textStyle, textAlign: TextAlign.center))
                    : Row(children: <Widget>[
                        Image(
                            width: 28.w,
                            height: 28.w,
                            fit: BoxFit.fill,
                            image: AssetImage(PathFiles.ImgPath + leading)),
                        SizedBox(width: 12.w),
                        SizedBox(
                            width: 95.w,
                            child: Text(buttonName,
                                style: textStyle, textAlign: TextAlign.start))
                      ]))));
  }
}

class CustomClipRRect extends StatelessWidget {
  const CustomClipRRect(
      {Key key,
      @required this.borderRadius,
      @required this.height,
      @required this.width,
      @required this.color,
      @required this.widget})
      : super(key: key);

  final double borderRadius;
  final double height;
  final double width;
  final Color color;
  final Widget widget;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: Localizations.localeOf(context).languageCode == 'en'
            ? BorderRadius.only(
                topLeft: Radius.circular(borderRadius.w),
                bottomRight: Radius.circular(borderRadius.w),
              )
            : BorderRadius.only(
                topRight: Radius.circular(borderRadius.w),
                bottomLeft: Radius.circular(borderRadius.w)),
        child: Container(
            height: height,
            width: width,
            margin: EdgeInsets.only(
                bottom: ConsDimensions.ButtonBottomShadow.h,
                right: ConsDimensions.ButtonHorizontalShadow.w),
            decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.25),
                      blurRadius: 6.0,
                      offset: Offset(0.0, 0.5))
                ],
                color: color,
                borderRadius:
                    Localizations.localeOf(context).languageCode == 'en'
                        ? BorderRadius.only(
                            topLeft: Radius.circular(borderRadius.w),
                            bottomRight: Radius.circular(borderRadius.w))
                        : BorderRadius.only(
                            topRight: Radius.circular(borderRadius.w),
                            bottomLeft: Radius.circular(borderRadius.w))),
            child: widget));
  }
}
