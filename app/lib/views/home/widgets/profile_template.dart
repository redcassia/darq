import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:darq/views/shared/custom_tile/default_tile.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/home/widgets/profile_design_parsing.dart';
import 'package:darq/views/home/widgets/profile_lists_variables.dart' as global;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/shared/button.dart';

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
        await rootBundle.loadString("assets/json_files/" + widget.jsonFile);
    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);
      global.col1 = map["col1"];
      global.col2 = map["col2"];
      global.col3 = map["col3"];
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
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(75.h),
            child: ProfileAppBar(widget: widget)),
        body: DefaultTile(
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
              Flexible(
                  flex: 1,
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        Flexible(
                            flex: 1,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                itemCount: global.col1.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[global.col1[index]]);
                                })),
                        Flexible(
                            flex: 2,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                padding: EdgeInsets.zero,
                                itemCount: global.col2.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[global.col2[index]]);
                                }))
                      ])),
              Flexible(
                  flex: 4,
                  child: ListView.builder(
                      shrinkWrap: true,
                      padding: EdgeInsets.zero,
                      itemCount: global.col3.length,
                      itemBuilder: (BuildContext context, int index) {
                        return Column(
                          mainAxisSize:   MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[global.col3[index]]);
                      }))
            ])));
  }
}

class ProfileAppBar extends StatelessWidget {
  const ProfileAppBar({Key key, this.widget}) : super(key: key);

  final ProfileTemplate widget;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
          right: widget.jsonFile == "domestic_help.json" ? 0 : 14.w, top: 40.h),
      child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            InkWell(
              child: RightRoundedCapsule(
                  verticalPadding: 5.h,
                  horizontalPadding: 19.w,
                  iconColor: Color(0xFF426676),
                  icon: Image(
                      width: 9.73.w,
                      fit: BoxFit.fill,
                      image: AssetImage(PathFiles.ImgPath + "back.png"))),
              onTap: () => Navigator.pop(context),
            ),
            Row(children: <Widget>[
              CustomButton(
                  height: 23.h,
                  width: 93.w,
                  buttonName: widget.jsonFile == "self_employed.json"
                      ? "Contact Me"
                      : "Contact Us",
                  color: Color(0xFFE1A854),
                  borderRadius: 27,
                  textStyle: AppFonts.title10Odd(color: Colors.white),
                  onButtonPressed: () => {}),
              widget.jsonFile == "domestic_help"
                  ? LeftRoundedCapsule(
                      horizontalPadding: 16.w,
                      verticalPadding: 5.h,
                      icon: Image(
                          fit: BoxFit.fitHeight,
                          width: 18.w,
                          image: AssetImage(PathFiles.ImgPath + "filter.png")))
                  : Container(
                      height: 0.h,
                    )
            ])
          ]),
    );
  }
}
