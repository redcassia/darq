import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/shared/drawer/drawer_item.dart';
import 'package:darq/views/home/screens/community.dart';
import 'package:darq/views/home/screens/list.dart';

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
                    return List(jsonFile: "events.json");
                  }))),
          DrawerItem(
              txt: "Q Cuisine",
              icon: "cuisine.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return List(jsonFile: "cuisine.json");
                  }))),
          DrawerItem(
              txt: "Q Entertainment",
              icon: "entertainment.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return List(jsonFile: "entertainment/default.json");
                  }))),
          DrawerItem(
              txt: "Q Children Education Centers",
              icon: "education_center.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return List(jsonFile: "children_education_center.json");
                  }))),
          DrawerItem(
              txt: "Made in Qatar",
              icon: "made_in_qatar.png",
              onClick: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return List(jsonFile: "made_in_qatar.json");
                  })))
        ]));
  }
}
