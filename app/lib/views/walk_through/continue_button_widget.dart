import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/views/widgets/button.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ContinueButton extends RoundedButton {
  ContinueButton({@required VoidCallback onPressed})
      : super(
            buttonName: translate("continue_button"),
            borderRadius: 19.h,
            textStyle: AppFonts.title7(color: Color(AppColors.white)),
            height: 37.h,
            padding: 23.w,
            buttonColor: Color(AppColors.burntSienna),
            onPressed: onPressed);
}
