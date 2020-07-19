import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/parsing/list_template_parsing.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/home/screens/filter.dart';

class List extends StatefulWidget {
  final String jsonFile;

  List({this.jsonFile});
  @override
  _ListState createState() => _ListState();
}

class _ListState extends State<List> {
  double rating = 0.0;

  parseGeneralColumn1(data) {
    for (int i = 0; i < global.generalC1.length; i++)
      setState(() => parseGeneralC1(index: i, rating: rating));
  }

  parseGeneralColumn2(data) {
    for (int i = 0; i < global.generalC2.length; i++)
      setState(() => parseGeneralC2(
          index: i, context: context, pagePath: widget.jsonFile));
  }

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      global.generalC1 = map["general_c1"];
      global.generalC2 = map["general_c2"];
      global.listAppBar = map["list_appbar"];

      parseGeneralColumn1(global.generalC1);
      parseGeneralColumn2(global.generalC2);
    });
    return "Success";
  }

  @override
  void initState() {
    this.loadJsonData();
    super.initState();
  }

  @override
  void dispose() {
    global.generalC1.clear();
    global.generalC2.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: global.listAppBar[1],
                bgImage: "app_bar_rectangle.png",
                leading: RightRoundedCapsule(
                    iconBgColor: Color.fromRGBO(134, 194, 194, 0.69),
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                onLeadingClicked: () => Navigator.pop(context),
                trailing: global.listAppBar[0] == "filter"
                    ? GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return Filter();
                          }));
                        },
                        child: LeftRoundedCapsule(
                            horizontalPadding: 16.w,
                            verticalPadding: 5.h,
                            icon: Image(
                                fit: BoxFit.fitHeight,
                                width: 18.w,
                                image: AssetImage(
                                    PathFiles.ImgPath + "filter.png"))),
                      )
                    : null)),
        body: ListView.builder(
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            itemCount: 8,
            itemBuilder: (BuildContext context, int index) {
              return Padding(
                  padding: EdgeInsets.only(top: 20.h),
                  child: DefaultCard(
                      margin: EdgeInsets.only(
                          right: 19.w, left: 20.w, bottom: 10.h),
                      padding: EdgeInsets.zero,
                      child: Padding(
                          padding: EdgeInsets.only(
                              left: 13.w, right: 28.w, top: 9.w, bottom: 8.h),
                          child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(
                                    width: 70.w,
                                    child: ListView.builder(
                                        shrinkWrap: true,
                                        physics: NeverScrollableScrollPhysics(),
                                        padding: EdgeInsets.zero,
                                        itemCount: global.generalC1.length,
                                        itemBuilder:
                                            (BuildContext context, int index) {
                                          return global.generalC1[index];
                                        })),
                                SizedBox(width: 17.w),
                                Expanded(
                                    child: ListView.builder(
                                        shrinkWrap: true,
                                        physics: NeverScrollableScrollPhysics(),
                                        padding: EdgeInsets.zero,
                                        itemCount: global.generalC2.length,
                                        itemBuilder:
                                            (BuildContext context, int index) {
                                          return global.generalC2[index];
                                        }))
                              ]))));
            }));
  }
}
