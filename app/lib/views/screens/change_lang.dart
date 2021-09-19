import 'dart:ui';

import 'package:darq/backend/session.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/utils/services/auth/localization_service.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/constants.dart';
import 'package:darq/views/home/home_page_.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/app_bars/back_arrow.dart';
import 'package:darq/views/widgets/app_bars/default_appbar.dart';
import 'package:darq/views/widgets/button.dart';
import 'package:darq/views/widgets/default_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:provider/provider.dart';

class ChangeLang extends StatefulWidget {
  @override
  _ChangeLangState createState() => _ChangeLangState();
}

class _ChangeLangState extends State<ChangeLang> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar:  PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                title: translate("change_lang_text")
            )),
        body: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
          Image(
              image: AssetImage(AssetPath.ImgPath + "select_language.png"),
              width: 283.w,
              fit: BoxFit.fitHeight),
          SizedBox(height: 35.h,),
          Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
            SizedBox(width: 5.w),
            InkWell(
                child: Text("English",
                    style: AppFonts.title7(
                        color:  Color(AppColors.cyprus))),
                onTap: () async {
                  await changeLocale(context, 'en_US');
                  await Session.setLocale('en');
                  Navigator.pop(context);
                }),
            Container(width: 3.w, color: Color(AppColors.cyprus), height: 16.h),
            InkWell(
                child: Text(
                  "العربية",
                  style: AppFonts.title7(
                      color: Color(AppColors.black).withOpacity(0.36)),
                ),
                onTap: () async {
                  await changeLocale(context, 'ar');
                  await Session.setLocale('ar');
                  Navigator.pop(context);
                  ;
                }),
            SizedBox(width: 5.w)
          ]),
          SizedBox(height: 40.h),
        ]));
  }
}
