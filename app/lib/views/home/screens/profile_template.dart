import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/parsing/profile_template_parsing.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';

class ProfileTemplate extends StatefulWidget {
  final String jsonFile;

  ProfileTemplate({this.jsonFile});
  @override
  _ProfileTemplateState createState() => _ProfileTemplateState();
}

class _ProfileTemplateState extends State<ProfileTemplate> {
  double rating = 0.0;
  List<dynamic> col1 = [];
  List<dynamic> col2 = [];
  List<dynamic> col3 = [];
  List<dynamic> profileAppBar = [];

  loadJsonData() {
    rootBundle
        .loadString(PathFiles.ProfilePath + widget.jsonFile)
        .then((value) => setState(() {
              Map<String, dynamic> map = json.decode(value);
              col1 = map["col1"];
              col2 = map["col2"];
              col3 = map["col3"];
              profileAppBar = map["profile_appbar"];
            }));
  }

  @override
  void initState() {
    this.loadJsonData();
    super.initState();
  }

  @override
  void dispose() {
    col1.clear();
    col2.clear();
    col3.clear();
    profileAppBar.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.h),
            child: ProfileAppBar(
                filterIndicator: profileAppBar.length > 0 ? profileAppBar[0] : "",
                buttonName: profileAppBar.length >1 ? profileAppBar[1] : "")),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 19.w, left: 20.w, top: 6.h),
            padding: EdgeInsets.only(
                left: 21.w, right: 19.w, top: 12.h, bottom: 17.h),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Flexible(
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                        SizedBox(
                            width: 80.w,
                            height: 110.h,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                itemCount: col1.length,
                                itemBuilder: (BuildContext context, int index) {
//                              return global.col1[index];
                                  return parseC1(
                                      data: col1[index], rating: rating);
                                })),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                itemCount: col2.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return parseC2(data: col2[index]);
                                }))
                      ])),
                  Flexible(
                      flex: 4,
                      child: ListView.builder(
                          shrinkWrap: true,
                          padding: EdgeInsets.zero,
                          itemCount: col3.length,
                          itemBuilder: (BuildContext context, int index) {
                            return parseC3(data: col3[index], context: context);
                          }))
                ])));
  }
}
