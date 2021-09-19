import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AppBarCustom extends StatelessWidget {
  const AppBarCustom(
      {this.leadingImgAddress,
      this.onLeadingPressed,
      this.title,
      this.isTrailingReady: false,
      this.onFilterPressed,
      Key key})
      : super(key: key);

  final String leadingImgAddress;
  final VoidCallback onLeadingPressed;
  final String title;
  final bool isTrailingReady;
  final VoidCallback onFilterPressed;

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(top: 54.h, left: 20.w, right: 20.w),
        child:
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          InkWell(
              child: RotatedBox(
                quarterTurns:
                Localizations.localeOf(context).languageCode == 'en'
                    ? 0
                    : 2,
                child: Image(
                    image: leadingImgAddress != null
                        ? AssetImage(AssetPath.ImgPath + leadingImgAddress)
                        : AssetImage(AssetPath.ImgPath + "back.png"),
                    width: leadingImgAddress != null ? 26.w : 11.67.w,
                    fit: BoxFit.fitHeight),
              ),
              onTap: () => leadingImgAddress != null
                  ? onLeadingPressed()
                  : Navigator.pop(context)),
          Text(title ?? "",
              style: AppFonts.title6(color: Color(AppColors.pickledBlueWood))),
          isTrailingReady == false
              ? Opacity(
                  opacity: 0.0,
                  child: Image(
                      image: leadingImgAddress != null
                          ? AssetImage(AssetPath.ImgPath + leadingImgAddress)
                          : AssetImage(AssetPath.ImgPath + "back.png"),
                      width: leadingImgAddress != null ? 26.w : 11.67.w,
                      fit: BoxFit.fitHeight),
                )
              : GestureDetector(
                  child: Image(
                      fit: BoxFit.fitHeight,
                      width: 18.w,
                      image: AssetImage(AssetPath.ImgPath + "filter.png")),
                  onTap: () => onFilterPressed())
        ]));
  }
}
