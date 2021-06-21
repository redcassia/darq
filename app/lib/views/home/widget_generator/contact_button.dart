import 'dart:ui';

import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/widgets/button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ContactButtonListPage extends RoundedButton {
  ContactButtonListPage(
      {@required String buttonName, @required VoidCallback onPressed})
      : super(
            borderRadius: 10.w,
            buttonName: buttonName,
            onPressed: onPressed,
            height: 23.h,
            padding: 19.w,
            buttonColor: Color(AppColors.atoll),
            textStyle: AppFonts.text9(
                color: Color(AppColors.white), fontWeight: FontWeight.w700));
}

class ContactButtonDetailedPage extends RoundedButton {
  ContactButtonDetailedPage(
      {@required String buttonName, @required VoidCallback onPressed})
      : super(
            borderRadius: 8.w,
            buttonName: buttonName,
            onPressed: onPressed,
            textStyle: AppFonts.text10(
                color: Color(AppColors.white), fontWeight: FontWeight.w700),
            buttonColor: Color(AppColors.burntSienna),
            height: 19.h,
            padding: 15.w);
}
