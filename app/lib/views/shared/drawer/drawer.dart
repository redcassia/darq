import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/home/screens/chat_list.dart';
import 'package:darq/views/home/screens/community.dart';
import 'package:darq/views/home/screens/home.dart';
import 'package:darq/views/home/screens/listing_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        height: SI.screenHeight,
        width: SI.screenWidth - 60.w,
        decoration: BoxDecoration(
            color: Color(0xFF86C2C2),
            borderRadius: Localizations.localeOf(context).languageCode == 'en'
                ? BorderRadius.only(topRight: const Radius.circular(80))
                : BorderRadius.only(topLeft: const Radius.circular(80))),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(height: 60.h),
              DrawerItem(
                  txt: translate("community"),
                  icon: "community.png",
                  onClick: () => Navigator.push(context,
                      MaterialPageRoute(builder: (context) => Community()))),
              DrawerItem(
                  txt: translate("events"),
                  icon: "events.png",
                  onClick: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              ListingPage(jsonFile: "events.json")))),
              DrawerItem(
                  txt: translate("cuisine"),
                  icon: "cuisine.png",
                  onClick: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              ListingPage(jsonFile: "cuisine.json")))),
              DrawerItem(
                  txt: translate("entertainment"),
                  icon: "entertainment.png",
                  onClick: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              ListingPage(jsonFile: "entertainment.json")))),
              DrawerItem(
                  txt: translate("child_education_centers"),
                  icon: "education_center.png",
                  onClick: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ListingPage(
                              jsonFile: "child_education_centers.json")))),
              DrawerItem(
                  txt: translate("made_in_qatar"),
                  icon: "made_in_qatar.png",
                  onClick: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              ListingPage(jsonFile: "made_in_qatar.json")))),
              DrawerItem(
                  txt: translate("home"),
                  icon: "home.png",
                  onClick: () => Navigator.push(context,
                      MaterialPageRoute(builder: (context) => Home()))),
              DrawerItem(
                  txt: translate("chat"),
                  icon: "chat.png",
                  onClick: () => Navigator.push(context,
                      MaterialPageRoute(builder: (context) => ChatList()))),
              DrawerItem(
                  txt: translate("change_lang"),
                  icon: "settings.png",
                  onClick: () => Navigator.push(context,
                      MaterialPageRoute(builder: (context) => ChatList()))),
              DrawerItem(
                  txt: translate("about_us"),
                  icon: "about_us.png",
                  onClick: () => Navigator.push(context,
                      MaterialPageRoute(builder: (context) => ChatList()))),
            ]));
  }
}
class DrawerItem extends StatelessWidget {
  const DrawerItem({@required this.txt, this.onClick, this.icon, Key key})
      : super(key: key);

  final String txt;
  final Function onClick;
  final String icon;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Padding(
            padding: EdgeInsets.only(top: 40.h, left: 20.w, right: 25.w),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Image(
                      width: 23.w,
                      height: 23.w,
                      fit: BoxFit.fill,
                      image: AssetImage(PathFiles.ImgPath + icon)),
                  SizedBox(width: 15.w),
                  Flexible(
                    child: Text(txt,
                        style: AppFonts.title7(color: Color(0xFF426676))),
                  )
                ])),
        onTap: () => onClick());
  }
}