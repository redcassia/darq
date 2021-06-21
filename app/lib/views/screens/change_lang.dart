import 'dart:ui';

import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/utils/services/auth/localization_service.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/constants.dart';
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

    final auth = Provider.of<AuthStateProvider>(context, listen: false);
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                bgImage: "app_bar_rectangle.png",
                leading: BackArrow(),
                onLeadingClicked: () => Navigator.pop(context))),
        body: DefaultCard(
            margin: EdgeInsets.only(
                right: 20.w, left: 20.w, bottom: 10.h, top: 10.h),
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 30.h),
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(translate("change_lang_text"),
                          style: AppFonts.title7(
                              color: Color.fromRGBO(0, 0, 0, 0.7))),
                      SizedBox(height: 20.h),
                      Image(
                          fit: BoxFit.fitHeight,
                          width: 250.w,
                          height: 140.h,
                          image: AssetImage(
                              AssetPath.ImgPath + "choose_lang_img.png")),
                      SizedBox(height: 30.h),
                      RoundedButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7(color: Colors.white),
                          height: 46.h,
                          padding: 109.w,
                          buttonName: "English",
                          buttonColor: Color(0xFF426676),
                          onPressed: () {
                            changeLocale(context, 'en_US');
                            GraphQLLocalization.setGraphQLLocale('en',auth);
                          }),
                      SizedBox(height: 11.h),
                      RoundedButton(
                          borderRadius: 34.1,
                          textStyle: AppFonts.title7(color: Colors.white),
                          height: 46.h,
                          padding: 109.w,
                          buttonName: "العربية",
                          buttonColor: Color(0xFFE1A854),
                          onPressed: () {
                            changeLocale(context, 'ar');
                            GraphQLLocalization.setGraphQLLocale('ar',auth);
                          })
                    ]))));
  }
}
