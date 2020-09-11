import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/home/screens/community.dart';
import 'package:darq/views/home/screens/home.dart';
import 'package:darq/views/home/screens/listing_page.dart';
import 'package:darq/views/shared/drawer/drawer_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        height: SI.screenHeight,
        width: SI.screenWidth - 60.w,
        decoration: BoxDecoration(
            color: Color(0xFF86C2C2),
            borderRadius:
                BorderRadius.only(topRight: const Radius.circular(80))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: <
            Widget>[
          SizedBox(height: 60.h),
          DrawerItem(
              txt: "Q Community",
              icon: "community.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return Community();
                  }))),
          DrawerItem(
              txt: "Q Events",
              icon: "events.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return ListingPage(jsonFile: "events.json");
                  }))),
          DrawerItem(
              txt: "Q Cuisine",
              icon: "cuisine.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return ListingPage(jsonFile: "cuisine.json");
                  }))),
          DrawerItem(
              txt: "Q Entertainment",
              icon: "entertainment.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return ListingPage(jsonFile: "entertainment.json");
                  }))),
          DrawerItem(
              txt: "Q Children Education Centers",
              icon: "education_center.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return ListingPage(
                        jsonFile: "children_education_center.json");
                  }))),
          DrawerItem(
              txt: "Made in Qatar",
              icon: "made_in_qatar.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return ListingPage(jsonFile: "made_in_qatar.json");
                  }))),
          DrawerItem(
              txt: "Home",
              icon: "made_in_qatar.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return Home();
                  })))
        ]));
  }
}
