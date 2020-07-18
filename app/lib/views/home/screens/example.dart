import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:darq/views/shared/custom_card/default_tile.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/parsing/profile_template_parsing.dart';
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/shared/profile_appbar.dart';
import 'package:darq/views/home/parsing/list_template_parsing.dart';
import 'package:darq/views/home/shared/txt_leading_row.dart';
import 'package:darq/views/home/shared/profile_appbar.dart';
class Example extends StatefulWidget {
  final String jsonFile;

  Example({this.jsonFile});
  @override
  _ExampleState createState() => _ExampleState();
}

class _ExampleState extends State<Example> {
  double rating = 0.0;

  parseGeneralColumn1(data) {
    for (int i = 0; i < global.generalC1.length; i++)
      setState(() => parseGeneralC1(index: i, rating: rating));
  }

  parseGeneralColumn2(data) {
    for (int i = 0; i < global.generalC2.length; i++)
      setState(() => parseGeneralC2(index: i,context: context,pagePath: widget.jsonFile));
  }

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      global.generalC1 = map["general_c1"];
      global.generalC2 = map["general_c2"];

      print(global.generalC1);
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
        appBar:  PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight),
            child: Text("hi")),
        body: ListView.builder(
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            itemCount: 8,
            itemBuilder: (BuildContext context, int index) {
              return Card(
                elevation: 5,
                color: Colors.white,
                shadowColor: Color.fromRGBO(0, 0, 0, 0.25),
                margin: EdgeInsets.only(
                    bottom: 25.h, right: 19.w, left: 20.w, top: 1.h),
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
                        ])),
              );
            }));
  }
}
