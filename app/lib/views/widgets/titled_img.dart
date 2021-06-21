import 'package:darq/constants/api_path.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter/material.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TitledImage extends StatelessWidget {
  const TitledImage(
      {Key key,
      @required this.title,
      @required this.subtitle,
      @required this.displayPicture,
      this.width,
      this.height,
      this.containerRadius,
      this.titleStyle,
      this.subTitleStyle,
      this.alignment})
      : super(key: key);

  final MainAxisAlignment alignment;
  final String title;
  final String subtitle;
  final String displayPicture;
  final double width;
  final double height;
  final double containerRadius;
  final TextStyle titleStyle;
  final TextStyle subTitleStyle;

  @override
  Widget build(BuildContext context) {
    return Container(
        width: width ?? 193.42.w,
        height: height ?? 134.h,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(containerRadius ?? 10.w),
            image: DecorationImage(
                fit: BoxFit.cover,
                image: NetworkImage(
                  APIPath.httpAttachmentPath + displayPicture,
                ))),
        child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 13.w, vertical: 10.h),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: alignment ?? MainAxisAlignment.end,
                mainAxisSize: MainAxisSize.max,
                children: [
                  TextWrapper(
                      text: title,
                      textStyle: titleStyle ??
                          AppFonts.title8(color: Color(AppColors.white))),
                  SizedBox(height: 3.h),
                  TextWrapper(
                      text: subtitle,
                      textStyle: subTitleStyle ??
                          AppFonts.title9(color: Color(AppColors.white)))
                ])));
  }
}

class TextWrapper extends StatelessWidget {
  const TextWrapper({
    Key key,
    @required this.text,
    @required this.textStyle,
  }) : super(key: key);

  final String text;
  final TextStyle textStyle;

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 8.w),
        decoration: BoxDecoration(
            color: Color(AppColors.black).withOpacity(0.5),
            borderRadius: BorderRadius.circular(4.w)),
        child: Text(text, style: textStyle));
  }
}
