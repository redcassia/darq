import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/shared/drawer/drawer_item.dart';

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
              txt: "Q Community", icon: "community.png", onClick: () => {}),
          DrawerItem(txt: "Q Events", icon: "events.png", onClick: () => {}),
          DrawerItem(txt: "Q Cuisine", icon: "cuisine.png", onClick: () => {}),
          DrawerItem(
              txt: "Q Entertainment",
              icon: "entertainment.png",
              onClick: () => {}),
          DrawerItem(
              txt: "Q Children Education Centers",
              icon: "education_center.png",
              onClick: () => {}),
          DrawerItem(
              txt: "Made in Qatar",
              icon: "made_in_qatar.png",
              onClick: () => {})
        ]));
  }
}
