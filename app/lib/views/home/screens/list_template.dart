import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/parsing/list_template_parsing.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/home/screens/filter.dart';

class ListTemplate extends StatefulWidget {
  final String jsonFile;

  ListTemplate({this.jsonFile});
  @override
  _ListTemplateState createState() => _ListTemplateState();
}

class _ListTemplateState extends State<ListTemplate> {
  double rating = 0.0;
  List<dynamic> generalC1 = [];
  List<dynamic> generalC2 = [];
  List<dynamic> listAppBar = [];

  loadJsonData() {
    rootBundle
        .loadString(PathFiles.ProfilePath + widget.jsonFile)
        .then((value) => setState(() {
              Map<String, dynamic> map = json.decode(value);
              generalC1 = map["general_c1"];
              generalC2 = map["general_c2"];
              listAppBar = map["list_appbar"];
            }));
  }

  @override
  void initState() {
    super.initState();
    this.loadJsonData();
  }

  @override
  void dispose() {
    generalC1.clear();
    generalC2.clear();
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
                title: listAppBar.length > 1 ? listAppBar[1] : "",
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
                trailing: listAppBar.length > 0 && listAppBar[0] == "filter"
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
                                        itemCount: generalC1.length,
                                        itemBuilder:
                                            (BuildContext context, int index) {
                                          return parseGeneralC1(
                                              data: generalC1[index],
                                              rating: rating);
                                        })),
                                SizedBox(width: 17.w),
                                Expanded(
                                    child: ListView.builder(
                                        shrinkWrap: true,
                                        physics: NeverScrollableScrollPhysics(),
                                        padding: EdgeInsets.zero,
                                        itemCount: generalC2.length,
                                        itemBuilder:
                                            (BuildContext context, int index) {
                                          return parseGeneralC2(
                                              data: generalC2[index],
                                              context: context,
                                              pagePath: widget.jsonFile);
                                        }))
                              ]))));
            }));
  }
}
