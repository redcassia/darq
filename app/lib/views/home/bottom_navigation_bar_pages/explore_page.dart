import 'package:darq/backend/session.dart';
import 'package:darq/utils/managers/explore_page_data_stream.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utils/ui/photo_stream_viewer_with_indicator.dart';
import 'package:darq/utils/ui/photo_stream_viewer_with_no_indicator.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/community_page.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/button.dart';
import 'package:darq/views/home/drawer.dart';
import 'package:flutter/material.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';
import 'package:provider/provider.dart';

class ExplorePage extends StatelessWidget {
  static final GlobalKey<ScaffoldState> scaffoldKey = new GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        key: scaffoldKey,
        drawer: CustomDrawer(),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                leadingImgAddress: "menu.png",
                onLeadingPressed: () =>
                    scaffoldKey.currentState.openDrawer())),
        body: Padding(
            padding: EdgeInsets.only(left: 20.w, right: 20.w, top: 20.h),
            child: SingleChildScrollView(child: BuildContent())));
  }
}

class BuildContent extends StatelessWidget {
  const BuildContent({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final database = Provider.of<ExplorePageData>(context, listen: false);
    return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(translate("explore"),
              style: AppFonts.title5(color: Color(AppColors.cyprus))),
          SizedBox(height: 16.h),
          Header(),
          SizedBox(height: 20.h),
          Text(translate("events"),
              style: AppFonts.title6(color: Color(AppColors.cyprus))),
          SizedBox(height: 20),
          PhotoStreamViewerWithIndicator(
              stream: database.eventsBusinessHLStream(),
              jsonFile: "events.json"),
          PhotoStreamViewerWithNoIndicator(
              jsonFile: "made_in_qatar.json",
              height: 183.h,
              width: 264.14.w,
              containerRadius: 22.w,
              listTitle: translate("made_in_qatar"),
              titleStyle: AppFonts.title6(color: Color(AppColors.white)),
              subTitleStyle: AppFonts.title8(color: Color(AppColors.white)),
              stream: database.madeInQatarBusinessHLStream()),
          PhotoStreamViewerWithNoIndicator(
              jsonFile: "child_education_centers.json",
              listTitle: translate("child_education_centers"),
              stream: database.childEducationCentersBusinessHLStream()),
          PhotoStreamViewerWithNoIndicator(
              jsonFile: "entertainment.json",
              listTitle: translate("entertainment"),
              stream: database.entertainmentBusinessHLStream()),
          PhotoStreamViewerWithNoIndicator(
              jsonFile: "cuisine.json",
              listTitle: translate("cuisine"),
              stream: database.cuisineBusinessHLStream())
        ]);
  }
}

class Header extends StatelessWidget {
  const Header({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(left: 29.w, right: 40.w),
        decoration: BoxDecoration(
            color: Color(AppColors.atoll),
            borderRadius: BorderRadius.circular(10.w)),
        child:
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                    width: 131.w,
                    child: Text(translate("find_what_you_need_in_one_place"),
                        style: AppFonts.title8(
                            color: Color(AppColors.white),
                            fontWeight: FontWeight.bold),
                        softWrap: true)),
                RoundedButton(
                    height: 23.h,
                    padding: 19.w,
                    buttonName: translate("community"),
                    buttonColor: Color(AppColors.burntSienna),
                    borderRadius: 27.w,
                    textStyle: AppFonts.text8(
                        color: Colors.white, fontWeight: FontWeight.w700),
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => CommunityPage())))
              ]),
          Image(
              image: AssetImage(AssetPath.ImgPath + "community_s.png"),
              width: 110.w,
              fit: BoxFit.fitHeight)
        ]));
  }
}
