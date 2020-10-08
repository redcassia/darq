import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/home_screens_style_const.dart';
import 'package:darq/views/shared/custom_divider.dart';
import 'package:darq/views/shared/full_img_wrapper.dart';
import 'package:darq/views/shared/leading_row.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PersonnelPage extends StatefulWidget {
  final dynamic data;
  bool isDriver;

  PersonnelPage({this.data}) : isDriver = data["profession"] == "Driver";

  @override
  _PersonnelPageState createState() => _PersonnelPageState();
}

class _PersonnelPageState extends State<PersonnelPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF426676),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.w),
            child: ProfileAppBar(
                filterIndicator: false, buttonName: "Contact Us")),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 20.w, left: 20.w, top: 6.h),
            padding: Localizations.localeOf(context).languageCode == 'en'
                ? EdgeInsets.only(
                    left: 21.w, right: 19.w, top: 12.h, bottom: 17.h)
                : EdgeInsets.only(
                    left: 19.w, right: 21.w, top: 12.h, bottom: 17.h),
            child: SingleChildScrollView(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        SizedBox(
                            width: 80.w,
                            height: 79.h,
                            child: Picture(
                                height: 79.h,
                                width: 80.w,
                                img: widget.data["picture"])),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(widget.data["name"],
                                      style: AppFonts.title9(
                                          color:
                                              Color.fromRGBO(0, 0, 0, 0.67))),
                                  SizedBox(height: 10.h),
                                  DataWidget(data: widget.data["profession"]),
                                  SizedBox(height: 5.h),
                                  DataWidget(data: widget.data["gender"]),
                                  SizedBox(height: 5.h),
                                  DataWidget(data: widget.data["nationality"])
                                ]))
                      ]),
                  Flexible(
                      flex: 4,
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 14.h),
                            CustomDivider(),
                            BipartiteRow(
                                leftTitle: "Religion:",
                                leftTxt: widget.data["religion"],
                                rightTitle: "Salary:",
                                rightTxt:
                                    "${widget.data["salary"]["value"]} ${widget.data["salary"]["currency"]}"),
                            CustomDivider(),
                            widget.data["profession"] == "Driver"
                                ? Column(children: [
                                    SizedBox(height: 17.h),
                                    TextLeadingRow(
                                        title: "License Expiration Date:",
                                        titleStyle: kTitle9Rgb_67,
                                        txt: widget.data["license_expiry_date"],
                                        txtStyle: kText9OddRgb_05),
                                    SizedBox(height: 17.h),
                                    CustomDivider()
                                  ])
                                : Container(),
                            SizedBox(height: 17.h),
                            TextLeadingRow(
                                title: "Date of Birth:",
                                titleStyle: kTitle9Rgb_67,
                                txt: widget.data["date_of_birth"],
                                txtStyle: kText9OddRgb_05),
                            SizedBox(height: 17.h),
                            CustomDivider(),
                            BipartiteRow(
                                leftTitle: "Status:",
                                leftTxt: widget.data["marital_status"],
                                rightTitle: "Age:",
                                rightTxt: widget.data["date_of_birth"]),
                            CustomDivider(),
                            BipartiteRow(
                                leftTitle: "Contact:",
                                leftTxt: widget.data["phone_number"],
                                rightTitle:
                                    widget.data["profession"] != "Driver"
                                        ? "Children:"
                                        : "",
                                rightTxt: widget.data["number_of_children"]
                                        ?.toString() ??
                                    ""),
                            CustomDivider(),
                            widget.data["profession"] != "Driver"
                                ? Column(children: [
                                    SizedBox(height: 17.h),
                                    TextLeadingRow(
                                        title: "Education:",
                                        titleStyle: kTitle9Rgb_67,
                                        txt: widget.data["education"],
                                        txtStyle: kText9OddRgb_05),
                                    SizedBox(height: 17.h),
                                    CustomDivider()
                                  ])
                                : Container(),
                            SizedBox(height: 17.h),
                            Wrap(
                                spacing: 6.w,
                                crossAxisAlignment: WrapCrossAlignment.start,
                                children: <Widget>[
                                  Text("Languages:", style: kTitle9Rgb_67),
                                  SizedBox(height: 17.h),
                                  for (int i = 0;
                                      i < widget.data["languages"]?.length ?? 0;
                                      i++)
                                    CustomChip(
                                        text: widget.data["languages"][i])
                                ]),
                            SizedBox(height: 17.h),
                            CustomDivider(),
                            SizedBox(height: 17.h),
                            TextLeadingRow(
                                title: "Experience:",
                                titleStyle: kTitle9Rgb_67,
                                widget: Flexible(
                                    child: Column(children: <Widget>[
                                  SizedBox(height: 3.h),
                                  ListView.builder(
                                      physics: NeverScrollableScrollPhysics(),
                                      shrinkWrap: true,
                                      padding: EdgeInsets.zero,
                                      itemCount:
                                          widget.data["experience"].length,
                                      itemBuilder:
                                          (BuildContext context, int i) {
                                        return Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Text(
                                                  "${widget.data["experience"][i]["country"]}${widget.data["experience"][i]["institution"] != null ? " - ${widget.data["experience"][i]["institution"]}" : ""}",
                                                  style: AppFonts.title11Odd(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.69))),
                                              Text(
                                                  "${widget.data["experience"][i]["from"]} - ${widget.data["experience"][i]["in_position"] ? "Present" : "${widget.data["experience"][i]["to"]}"}",
                                                  style: AppFonts.text9odd(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.5))),
                                              SizedBox(height: 4.h)
                                            ]);
                                      })
                                ]))),
                            SizedBox(height: 17.h),
                            CustomDivider(),
                            widget.isDriver
                                ? Container()
                                : BipartiteRow(
                                    leftTitle: "Height:",
                                    leftWidget: RichText(
                                        textAlign: TextAlign.start,
                                        text: TextSpan(
                                            style: kText9OddRgb_05,
                                            children: <TextSpan>[
                                              TextSpan(
                                                  text: widget.data["height"]),
                                              TextSpan(
                                                  text: " cm",
                                                  style: AppFonts.title10(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.7)))
                                            ])),
                                    rightTitle: "Weight:",
                                    rightWidget: RichText(
                                        textAlign: TextAlign.start,
                                        text: TextSpan(
                                            style: kText9OddRgb_05,
                                            children: <TextSpan>[
                                              TextSpan(
                                                  text: widget.data["weight"]),
                                              TextSpan(
                                                  text: " kg",
                                                  style: AppFonts.title10(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.7)))
                                            ])),
                                  ),
                            widget.isDriver ? Container() : CustomDivider(),
                            widget.isDriver
                                ? Container()
                                : SizedBox(height: 17.h),
                            widget.isDriver
                                ? Container()
                                : Wrap(spacing: 6.w, children: <Widget>[
                                    Text("Skills:", style: kTitle9Rgb_67),
                                    SizedBox(height: 17.h),
                                    for (int i = 0;
                                        i < widget.data["skills"]?.length ?? 0;
                                        i++)
                                      CustomChip(text: widget.data["skills"][i])
                                  ]),
                            widget.isDriver
                                ? Container()
                                : SizedBox(height: 17.h),
                            widget.isDriver ? Container() : CustomDivider(),
                            SizedBox(height: 17.h),
                            SizedBox(
                                height: 125.h,
                                child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text("Attachments", style: kTitle9Rgb_67),
                                      SizedBox(height: 17.h),
                                      Flexible(
                                          child: ListView.builder(
                                              scrollDirection: Axis.horizontal,
                                              shrinkWrap: true,
                                              padding: EdgeInsets.zero,
                                              itemCount: 3,
                                              itemBuilder:
                                                  (BuildContext context,
                                                      int index) {
                                                return Padding(
                                                    padding: EdgeInsets.only(
                                                        right: 6.w),
                                                    child: InkWell(
                                                        child: CachedNetworkImage(
                                                            imageUrl:
                                                                "http://redcassia.com:3001/attachment/",
                                                            placeholder: (context,
                                                                    url) =>
                                                                CircularProgressIndicator(),
                                                            errorWidget:
                                                                (context, url,
                                                                        error) =>
                                                                    Icon(Icons
                                                                        .error),
                                                            filterQuality:
                                                                FilterQuality
                                                                    .high,
                                                            width: 141.w,
                                                            height: 101.h,
                                                            fit:
                                                                BoxFit.contain),
                                                        onTap: () {
                                                          Navigator.push(
                                                              context,
                                                              MaterialPageRoute(
                                                                  builder: (context) =>
                                                                      FullImageWrapper(
                                                                          imageProvider:
                                                                              "http://redcassia.com:3001/attachment/")));
                                                        }));
                                              }))
                                    ]))
                          ]))
                ]))));
  }
}

class DataWidget extends StatelessWidget {
  const DataWidget({
    Key key,
    @required this.data,
  }) : super(key: key);

  final String data;

  @override
  Widget build(BuildContext context) {
    return Text(data,
        style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));
  }
}

class BipartiteRow extends StatelessWidget {
  const BipartiteRow(
      {Key key,
      @required this.leftTitle,
      @required this.leftTxt,
      this.leftWidget,
      this.rightTitle,
      this.rightTxt,
      this.rightWidget})
      : super(key: key);

  final String leftTitle;
  final String leftTxt;
  final Widget leftWidget;
  final String rightTxt;
  final String rightTitle;
  final Widget rightWidget;

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      SizedBox(
        width: 147.w,
        child: TextLeadingRow(
            title: leftTitle,
            titleStyle: kTitle9Rgb_67,
            txt: leftTxt,
            widget: leftWidget,
            txtStyle: kText9OddRgb_05),
      ),
      Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
      SizedBox(width: 10.w),
      TextLeadingRow(
          title: rightTitle,
          titleStyle: kTitle9Rgb_67,
          txt: rightTxt,
          widget: rightWidget,
          txtStyle: kText9OddRgb_05)
    ]);
  }
}
