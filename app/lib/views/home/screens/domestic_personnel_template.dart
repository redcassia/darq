import 'package:darq/views/home/parsing/personnel_template_parsing.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'dart:ui';
import 'package:flutter/rendering.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';

class DomesticPersonnelTemplate extends StatefulWidget {
  final String jsonFile;
  DomesticPersonnelTemplate({this.jsonFile});
  @override
  _DomesticPersonnelTemplateState createState() =>
      _DomesticPersonnelTemplateState();
}

class _DomesticPersonnelTemplateState extends State<DomesticPersonnelTemplate> {
  parsePersonnelColumn1(data) {
    for (int i = 0; i < global.personnelC1.length; i++)
      setState(() => {parsePersonnelC1(index: i)});
  }

  parsePersonnelColumn2(data) {
    for (int i = 0; i < global.personnelC2.length; i++)
      setState(() => {parsePersonnelC2(index: i)});
  }

  parsePersonnelColumn3(data) {
    for (int i = 0; i < global.personnelC3.length; i++)
      setState(() => {parsePersonnelC3(index: i, context: context)});
  }

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      global.personnelC1 = map["personnel_c1"];
      global.personnelC2 = map["personnel_c2"];
      global.personnelC3 = map["personnel_c3"];

      parsePersonnelColumn1(global.personnelC1);
      parsePersonnelColumn2(global.personnelC2);
      parsePersonnelColumn3(global.personnelC3);
    });
    return "Success";
  }

  @override
  void initState() {
    global.profileAppBar[0] = "no_filter";
    this.loadJsonData();
    super.initState();
  }

  @override
  void dispose() {
    global.personnelC1.clear();
    global.personnelC2.clear();
    global.personnelC3.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF426676),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.w),
            child: ProfileAppBar(
                backArrowBgColor: Color.fromRGBO(134, 194, 194, 0.69))),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 19.w, left: 20.w, top: 6.h),
            padding: EdgeInsets.only(
                left: 21.w, right: 19.w, top: 12.h, bottom: 17.h),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        SizedBox(
                            width: 80.w,
                            height: 79.h,
                            child: ListView.builder(
                                shrinkWrap: true,
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                itemCount: global.personnelC1.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return global.personnelC1[index];
                                })),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                shrinkWrap: true,
                                itemCount: global.personnelC2.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return global.personnelC2[index];
                                }))
                      ]),
                  Flexible(
                      flex: 4,
                      child: ListView.builder(
                          shrinkWrap: true,
                          padding: EdgeInsets.zero,
                          itemCount: global.personnelC3.length,
                          itemBuilder: (BuildContext context, int index) {
                            return global.personnelC3[index];
                          }))
                ])));
  }
}
