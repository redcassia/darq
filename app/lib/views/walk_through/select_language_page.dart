import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/utils/services/auth/localization_service.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/utils/managers/walk_through_provider.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:provider/provider.dart';

class SelectLanguagePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(translate("select_your_language"),
              style: AppFonts.title4(color: Color(AppColors.cyprus))),
          SizedBox(height: 3.h),
          Image(
              image: AssetImage(AssetPath.ImgPath + "select_language.png"),
              width: 283.w,
              fit: BoxFit.fitHeight),
          SizedBox(height: 88.h),
          SelectLanguage(),
          SizedBox(height: 53.h)
        ]);
  }
}

class SelectLanguage extends StatelessWidget {
  const SelectLanguage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authState =
        Provider.of<AuthStateProvider>(context, listen: false);
    final stateNotifier = Provider.of<SelectLangWidgetsProvider>(context, listen: false);
    return Column(children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        SizedBox(width: 5.w),
        InkWell(
            child: Text("English",
                style: AppFonts.title7(
                    color: stateNotifier.getSelectedLangIsEnglish
                        ? Color(AppColors.cyprus)
                        : Color(AppColors.black).withOpacity(0.36))),
            onTap: () async {
              if (stateNotifier.getLoadingIndicator) return null;
              await changeLocale(context, 'en_US');
              stateNotifier.setLoadingIndicator = true;
              stateNotifier.setSelectedLangIsEnglish = true;
              await GraphQLLocalization.setGraphQLLocale("en", authState);
            }),
        Container(width: 3.w, color: Color(AppColors.cyprus), height: 16.h),
        InkWell(
            child: Text(
              "العربية",
              style: AppFonts.title7(
                  color: !stateNotifier.getSelectedLangIsEnglish
                      ? Color(AppColors.cyprus)
                      : Color(AppColors.black).withOpacity(0.36)),
            ),
            onTap: () async {
              if (stateNotifier.getLoadingIndicator) return null;
              await changeLocale(context, 'ar');
              stateNotifier.setLoadingIndicator = true;
              stateNotifier.setSelectedLangIsEnglish = false;
              await GraphQLLocalization.setGraphQLLocale("ar", authState);
            }),
        SizedBox(width: 5.w)
      ]),
      SizedBox(height: 40.h),
      stateNotifier.getLoadingIndicator
          ? CircularProgressIndicator(backgroundColor: Color(AppColors.cyprus))
          : Container(height: 0)
    ]);
  }
}
