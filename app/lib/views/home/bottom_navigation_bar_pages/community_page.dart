import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/listing_page.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CommunityPage extends StatelessWidget {
  CommunityPage({this.enableBackButton: true});
  final bool enableBackButton;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(50.h),
            child: enableBackButton ? AppBarCustom() : Text("")),
        body: Container(
            margin: EdgeInsets.only(left: 20.w, right: 20.w, top:enableBackButton ? 20.h : 60.h ),
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(translate("we_are_your_community"),
                  style: AppFonts.title5(color: Color(AppColors.cyprus))),
              SizedBox(height: 10.h),
              Text(translate("choose_what_you_need"),
                  style: AppFonts.title7(color: Color(AppColors.cyprus))),
                  SizedBox(height: 10.h),
              Center(
                  child: Image(
                      image:
                          AssetImage(AssetPath.ImgPath + "community_l.png"))),
              Expanded(
                  child: Center(
                      child: Wrap(
                          spacing: 12.41.w,
                          runSpacing: 32.41.h,
                          children: [
                    LargeRoundedButton(
                        imgName: "beauty_spa",
                        txt: "Beauty & Spa",
                        jsonFile: "beauty_spa.json"),
                    LargeRoundedButton(
                        imgName: "sports",
                        txt: "Sports",
                        jsonFile: "sports.json"),
                    LargeRoundedButton(
                        imgName: "limousine",
                        txt: "Limousine",
                        jsonFile: "limousine.json"),
                    LargeRoundedButton(
                      imgName: "hospitality",
                      txt: "Hospitality",
                      jsonFile: "hospitality.json",
                    ),
                    LargeRoundedButton(
                        imgName: "cleaning_maintenance",
                        txt: "Cleaning & Maintenance",
                        jsonFile: "cleaning_maintenance.json"),
                    LargeRoundedButton(
                        imgName: "self_employed",
                        txt: "Self Employed",
                        jsonFile: "self_employed.json"),
                    LargeRoundedButton(
                        imgName: "domestic_help",
                        txt: "Domestic Help",
                        jsonFile: "domestic_help.json"),
                    LargeRoundedButton(
                        imgName: "stationeries",
                        txt: "Stationeries",
                        jsonFile: "stationeries.json")
                  ])))
            ])));
  }
}

class LargeRoundedButton extends StatelessWidget {
  const LargeRoundedButton({
    Key key,
    @required this.imgName,
    @required this.txt,
    @required this.jsonFile,
  }) : super(key: key);

  final String imgName;
  final String txt;
  final String jsonFile;

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => ListingPage(jsonFile: jsonFile))),
        child: Container(
            width: 91.w,
            height: 91.h,
            decoration: BoxDecoration(
                color: Color(AppColors.atoll),
                borderRadius: BorderRadius.all(Radius.circular(22.w))),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Image(
                  width: 25.22.w,
                  height: 21.63.h,
                  fit: BoxFit.contain,
                  image: AssetImage(AssetPath.ImgPath + imgName + ".png")),
              SizedBox(height: 9.4.h),
              Text(txt,
                  textAlign: TextAlign.center,
                  style: AppFonts.text9(
                      color: Color(AppColors.white),
                      fontWeight: FontWeight.w700))
            ])));
  }
}
