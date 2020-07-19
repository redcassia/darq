import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/parsing/profile_template_parsing.dart';
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
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

  parseColumn1(data) {
    for (int i = 0; i < global.col1.length; i++)
      setState(() => parseC1(index: i, rating: rating));
  }

  parseColumn2(data) {
    for (int i = 0; i < global.col2.length; i++)
      setState(() => parseC2(index: i));
  }

  parseColumn3(data) {
    for (int i = 0; i < global.col3.length; i++)
      setState(() => parseC3(index: i, context: context));
  }

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      global.col1 = map["col1"];
      global.col2 = map["col2"];
      global.col3 = map["col3"];
      global.profileAppBar = map["profile_appbar"];
      print(global.profileAppBar);
      parseColumn1(global.col1);
      parseColumn2(global.col2);
      parseColumn3(global.col3);
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
    global.col1.clear();
    global.col2.clear();
    global.col3.clear();
    global.profileAppBar.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.h),
            child: ProfileAppBar()),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 19.w, left: 20.w, top: 6.h),
            padding:EdgeInsets.only(
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
                            itemCount: global.col1.length,
                            itemBuilder: (BuildContext context, int index) {
                              return global.col1[index];
                            })),
                    SizedBox(width: 17.w),
                    Flexible(
                        flex: 2,
                        child: ListView.builder(
                            physics: NeverScrollableScrollPhysics(),
                            padding: EdgeInsets.zero,
                            itemCount: global.col2.length,
                            itemBuilder: (BuildContext context, int index) {
                              return global.col2[index];
                            }))
                  ])),
              Flexible(
                  flex: 4,
                  child: ListView.builder(
                      shrinkWrap: true,
                      padding: EdgeInsets.zero,
                      itemCount: global.col3.length,
                      itemBuilder: (BuildContext context, int index) {
                        return global.col3[index];
                      }))
            ])));
  }
}
