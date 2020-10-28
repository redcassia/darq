import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/home_screens_style_const.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/custom_divider.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/full_img_wrapper.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/leading_row.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:intl/intl.dart';

class PersonnelPage extends StatefulWidget {
  final dynamic data;
  bool isDriver;
  final String id;
  PersonnelPage({this.data, this.id})
      : isDriver = data["profession"] == "Driver";
  @override
  _PersonnelPageState createState() => _PersonnelPageState();
}

int getAge(String birthDate) {
  String year = birthDate.substring(0, birthDate.indexOf('-'));
  final DateTime now = DateTime.now();
  final DateFormat formatter = DateFormat('yyyy-MM-dd');
  final String formatted = formatter.format(now);
  return int.parse(formatted.substring(0, formatted.indexOf('-'))) -
      int.parse(year);
}

class _PersonnelPageState extends State<PersonnelPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF426676),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.w),
            child: ProfileAppBar(
                id: widget.id,
                rateButton: false,
                filterIndicator: false,
                buttonName: translate("contact_us"))),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 20.w, left: 20.w),
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
                            height: 80.w,
                            child: Picture(
                                height: 79.h,
                                width: 80.w,
                                img: widget.data["picture"])),
                        SizedBox(width: 17.w),
                        Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(widget.data["name"],
                                  style: AppFonts.title9(
                                      color:
                                          Color.fromRGBO(0, 0, 0, 0.67))),
                              SizedBox(height: 5.h),
                              DataWidget(
                                  data:
                                      translate(widget.data["profession"])),
                              SizedBox(height: 3.h),
                              DataWidget(
                                  data: translate(widget.data["gender"])),
                              SizedBox(height: 3.h),
                              DataWidget(
                                  data:
                                      translate(widget.data["nationality"]))
                            ])
                      ]),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(height: 14.h),
                        CustomDivider(),
                        BipartiteRow(
                            leftTitle: translate("religion"),
                            leftTxt: widget.data["religion"],
                            rightTitle: translate("salary"),
                            rightTxt:
                                "${Session.formatInt(widget.data["salary"]["value"])} ${translate(widget.data["salary"]["currency"])}"),
                        CustomDivider(),
                        widget.data["profession"] == "Driver"
                            ? Column(children: [
                                SizedBox(height: 17.h),
                                TextLeadingRow(
                                    title: translate(
                                        "license_expiration_date"),
                                    titleStyle: kTitle9Rgb_67,
                                    txt: Session.formatDate(
                                        widget.data["license_expiry_date"]),
                                    txtStyle: kText9OddRgb_05),
                                SizedBox(height: 17.h),
                                CustomDivider()
                              ])
                            : Container(),
                        SizedBox(height: 17.h),
                        TextLeadingRow(
                            title: translate("date_of_birth"),
                            titleStyle: kTitle9Rgb_67,
                            txt: Session.formatDate(
                                widget.data["date_of_birth"]),
                            txtStyle: kText9OddRgb_05),
                        SizedBox(height: 17.h),
                        CustomDivider(),
                        BipartiteRow(
                            leftTitle: translate("status"),
                            leftTxt:
                                translate(widget.data["marital_status"]),
                            rightTitle: translate("age"),
                            rightTxt: Session.formatInt(
                                getAge(widget.data["date_of_birth"]))),
                        CustomDivider(),
                        BipartiteRow(
                            leftTitle: translate("contact"),
                            leftTxt: Session.formatInt(
                                int.parse(widget.data["phone_number"])),
                            rightTitle:
                                widget.data["profession"] != "Driver"
                                    ? translate("children")
                                    : "",
                            rightTxt:
                                widget.data["number_of_children"] != null
                                    ? Session.formatInt(
                                        widget.data["number_of_children"])
                                    : ""),
                        CustomDivider(),
                        widget.data["profession"] != "Driver"
                            ? Column(children: [
                                SizedBox(height: 17.h),
                                TextLeadingRow(
                                    title: translate("education"),
                                    titleStyle: kTitle9Rgb_67,
                                    txt:
                                        translate(widget.data["education"]),
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
                              Text(translate("languages"),
                                  style: kTitle9Rgb_67),
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
                            title: translate("experience"),
                            titleStyle: kTitle9Rgb_67,
                            widget: widget.data["experience"].length != 0
                                ? Flexible(
                                    child: Column(children: <Widget>[
                                    SizedBox(height: 3.h),
                                    ListView.builder(
                                        physics:
                                            NeverScrollableScrollPhysics(),
                                        shrinkWrap: true,
                                        padding: EdgeInsets.zero,
                                        itemCount: widget
                                            .data["experience"].length,
                                        itemBuilder:
                                            (BuildContext context, int i) {
                                          return Column(
                                              mainAxisSize:
                                                  MainAxisSize.min,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                    "${translate(widget.data["experience"][i]["country"])}${widget.data["experience"][i]["institution"] != null ? " - ${widget.data["experience"][i]["institution"]}" : ""}",
                                                    style:
                                                        AppFonts.title11Odd(
                                                            color: Color
                                                                .fromRGBO(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0.69))),
                                                Text(
                                                    "${Session.formatDate(widget.data["experience"][i]["from"])}   -   ${widget.data["experience"][i]["in_position"] ? translate("present") : "${Session.formatDate(widget.data["experience"][i]["to"])}"}",
                                                    style:
                                                        AppFonts.text9odd(
                                                            color: Color
                                                                .fromRGBO(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0.5))),
                                                SizedBox(height: 4.h)
                                              ]);
                                        })
                                  ]))
                                : Text(translate("none"),
                                    style: kText9OddRgb_05)),
                        SizedBox(height: 17.h),
                        CustomDivider(),
                        widget.isDriver
                            ? Container()
                            : BipartiteRow(
                                leftTitle: translate("height"),
                                leftWidget: RichText(
                                    textAlign: TextAlign.start,
                                    text: TextSpan(
                                        style: kText9OddRgb_05,
                                        children: <TextSpan>[
                                          TextSpan(
                                              text: Session.formatInt(
                                                  int.parse(widget
                                                      .data["height"]))),
                                          TextSpan(
                                              text: translate("cm"),
                                              style: AppFonts.title10(
                                                  color: Color.fromRGBO(
                                                      0, 0, 0, 0.7)))
                                        ])),
                                rightTitle: translate("weight"),
                                rightWidget: RichText(
                                    textAlign: TextAlign.start,
                                    text: TextSpan(
                                        style: kText9OddRgb_05,
                                        children: <TextSpan>[
                                          TextSpan(
                                              text: Session.formatInt(
                                                  int.parse(widget
                                                      .data["weight"]))),
                                          TextSpan(
                                              text: translate("kg"),
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
                                Text(translate("skills"),
                                    style: kTitle9Rgb_67),
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
                        widget.data["attachments"].length != 0
                            ? SizedBox(
                                height: 125.h,
                                child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text(translate("attachments"),
                                          style: kTitle9Rgb_67),
                                      SizedBox(height: 17.h),
                                      Flexible(
                                          child: ListView.builder(
                                              scrollDirection:
                                                  Axis.horizontal,
                                              shrinkWrap: true,
                                              padding: EdgeInsets.zero,
                                              itemCount: widget
                                                      .data["attachments"]
                                                      ?.length ??
                                                  0,
                                              itemBuilder:
                                                  (BuildContext context,
                                                      int index) {
                                                return Padding(
                                                    padding:
                                                        EdgeInsets.only(
                                                            right: 6.w),
                                                    child: InkWell(
                                                        child: CachedNetworkImage(
                                                            imageUrl:
                                                                "http://redcassia.com:3001/attachment/${widget.data["attachments"][index]}",
                                                            placeholder: (context,
                                                                    url) =>
                                                                CircularProgressIndicator(),
                                                            errorWidget: (context,
                                                                    url,
                                                                    error) =>
                                                                Icon(Icons
                                                                    .error),
                                                            filterQuality:
                                                                FilterQuality
                                                                    .high,
                                                            width: 141.w,
                                                            height: 101.h,
                                                            fit: BoxFit
                                                                .contain),
                                                        onTap: () {
                                                          Navigator.push(
                                                              context,
                                                              MaterialPageRoute(
                                                                  builder: (context) =>
                                                                      FullImageWrapper(
                                                                          imageProvider: "http://redcassia.com:3001/attachment/${widget.data["attachments"][index]}")));
                                                        }));
                                              }))
                                    ]))
                            : Container()
                      ])
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
