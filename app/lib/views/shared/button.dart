import 'package:darq/res/path_files.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/custom_clip_rrect.dart';

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
                    : EdgeInsets.only(left: 34.w),
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
