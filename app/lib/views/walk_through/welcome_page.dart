import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/explore_page.dart';
import 'package:darq/views/home/home_page_.dart';
import 'package:darq/views/walk_through/continue_button_widget.dart';
import 'package:darq/views/walk_through/select_language_page.dart';
import 'package:darq/utils/managers/walk_through_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';
import 'package:provider/provider.dart';
import 'package:darq/utils/helpers/screen_dimensions_helper.dart';

class WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 48.w),
                child: Content())));
  }
}

class Content extends StatelessWidget {
  const Content({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ScreenDimensionsHelper.setScreenHeight =  MediaQuery.of(context).size.height;
    ScreenDimensionsHelper.setScreenWidth =  MediaQuery.of(context).size.width;
    final stateNotifier =
        Provider.of<FlipProvider>(context, listen: true);
    return stateNotifier.getFlipToToSelectLanguagePage ?
         SelectLanguagePage()
        : Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
                Image.asset(AssetPath.ImgPath + "landing_page.png"),
                SizedBox(height: 30.h),
                Text(translate("welcome"),
                    style: AppFonts.title1(color: Color(AppColors.cyprus))),
                SizedBox(height: 20.h),
                RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                        style: AppFonts.title1(color: Color(AppColors.cyprus)),
                        children: <TextSpan>[
                          TextSpan(text: translate("see_what_is_happening")),
                          TextSpan(
                            text: translate("qatar"),
                            style: AppFonts.title1(
                                color: Color(AppColors.burntSienna)),
                          ),
                          TextSpan(text: translate("right_now"))
                        ])),
                SizedBox(height: 33.h),
                ContinueButton(
                    onPressed: ()  {
                      Session.getClient().then((value) {
                        if( value != null)
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (BuildContext context) => HomePage(client: value),
                          ),
                              (route) => false,
                        );
                        else
                          stateNotifier.setFlipToToSelectLanguagePage = true;
                      });

                    }
                        )
              ]);
  }
}
