import 'dart:convert';
import 'dart:ui';

import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/parsing/personnel_template_parsing.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DomesticPersonnelTemplate extends StatefulWidget {
  final String jsonFile;
  DomesticPersonnelTemplate({this.jsonFile});
  @override
  _DomesticPersonnelTemplateState createState() =>
      _DomesticPersonnelTemplateState();
}

class _DomesticPersonnelTemplateState extends State<DomesticPersonnelTemplate> {
  List<dynamic> personnelC1 = [];
  List<dynamic> personnelC2 = [];
  List<dynamic> personnelC3 = [];

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      personnelC1 = map["personnel_c1"];
      personnelC2 = map["personnel_c2"];
      personnelC3 = map["personnel_c3"];
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
    personnelC1.clear();
    personnelC2.clear();
    personnelC3.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF426676),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.w),
            child: ProfileAppBar(
                backArrowBgColor: Color.fromRGBO(134, 194, 194, 0.69),
                filterIndicator: "no_filter",
                buttonName: "Contact Us")),
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
                                itemCount: personnelC1.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return parsePersonnelC1(
                                      data: personnelC1[index]);
                                })),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                shrinkWrap: true,
                                itemCount: personnelC2.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return parsePersonnelC2(
                                      data: personnelC2[index]);
                                }))
                      ]),
                  Flexible(
                      flex: 4,
                      child: ListView.builder(
                          shrinkWrap: true,
                          padding: EdgeInsets.zero,
                          itemCount: personnelC3.length,
                          itemBuilder: (BuildContext context, int index) {
                            return parsePersonnelC3(
                                data: personnelC3[index], context: context);
                          }))
                ])));
  }
}
