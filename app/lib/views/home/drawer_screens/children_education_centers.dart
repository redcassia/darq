import 'dart:ui';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/shared/custom_tile/custom_tile.dart';
import 'package:darq/views/shared/custom_tile/tile_content_expanded.dart';
import 'package:darq/views/shared/custom_tile/tile_content_leading.dart';
import 'package:darq/elements/app_fonts.dart';
class ChildrenEducationCenters extends StatefulWidget {
  @override
  _ChildrenEducationCentersState createState() =>
      _ChildrenEducationCentersState();
}

class _ChildrenEducationCentersState extends State<ChildrenEducationCenters> {
  var rating = 0.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFF5F9FA),
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(124.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: "Children Education Centers",
                bgImage: "app_bar_rectangle.png",
                leading: RightRoundedCapsule(
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                trailing: LeftRoundedCapsule(
                    horizontalPadding: 16.w,
                    verticalPadding: 5.h,
                    icon: Image(
                        fit: BoxFit.fitHeight,
                        width: 18.w,
                        image: AssetImage(PathFiles.ImgPath + "filter.png"))),
                onLeadingClicked: () => Navigator.pop(context))),
        body: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            child: ListView.builder(
                itemCount: 15,
                padding: EdgeInsets.only(top: 147.h),
                itemBuilder: (context, index) {
                  return CustomTile(
                      leftWidget: TileContentLeading(
                          profilePic: "avatar.png",
                          rating: rating,
                          onRatingChange: (v) => setState(() {
                                rating = v;
                              })),
                      rightWidget: Expanded(
                          child: TileContentExpanded(
                              title: "Kids International Pre-School",
                              descriptionWidget: Column(children: <Widget>[
                                Row(children: <Widget>[
                                  Text("Address: ", style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7))),
                                  Text("Al Nasser, St. 827",style: AppFonts.text9(color: Color.fromRGBO(0, 0, 0, 0.7)))
                                ]),
                                Row(children: <Widget>[
                                  Text("Founded: ", style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7))),
                                  Text("2012",style: AppFonts.text9(color: Color.fromRGBO(0, 0, 0, 0.7)))
                                ]),
                                Row(children: <Widget>[
                                  Text("Curriculum: ", style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7))),
                                  Text("Canadian, British",style: AppFonts.text9(color: Color.fromRGBO(0, 0, 0, 0.7)))
                                ])
                              ]),
                              buttonName: "Contact Me",
                              onButtonClicked: (_) => _
                                  ? print("clicked")
                                  : print("not clicked"))));
                })));
  }
}
