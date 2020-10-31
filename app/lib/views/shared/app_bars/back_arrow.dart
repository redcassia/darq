import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/rounded_capsule.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class BackArrow extends StatelessWidget {
  const BackArrow({
    Key key,
    this.backArrowBgColor,
  }) : super(key: key);

  final Color backArrowBgColor;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      child: RoundedCapsule(
          Localizations.localeOf(context).languageCode == 'en'
              ? "right"
              : "left",
          verticalPadding: 5.h,
          horizontalPadding: 19.w,
          iconBgColor: backArrowBgColor ?? Color.fromRGBO(134, 194, 194, 0.69),
          icon:RotatedBox(
            quarterTurns:
            Localizations.localeOf(context).languageCode == 'en'
                ? 0
                : 2,
            child: Image(
                width: 9.73.w,
                fit: BoxFit.fill,
                image: AssetImage(PathFiles.ImgPath + "back.png")),
          )),
      onTap: () => Navigator.pop(context),
    );
  }
}