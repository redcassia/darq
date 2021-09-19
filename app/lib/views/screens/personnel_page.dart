import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants.dart';
import 'package:darq/utils/services/local_storage_time_service.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/app_bars/profile_appbar.dart';
import 'package:darq/views/widgets/custom_chip.dart';
import 'package:darq/views/widgets/custom_divider.dart';
import 'package:darq/views/widgets/default_card.dart';
import 'package:darq/views/widgets/full_img_wrapper.dart';
import 'package:darq/views/widgets/image_container.dart';
import 'package:darq/views/widgets/leading_row.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

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
  String phoneNumber;
  String phoneNumberWithNoSpaces;
  Map<String, dynamic> _layout;

  @override
  void initState() {
    super.initState();
    phoneNumberWithNoSpaces = widget.data["phone_number"].replaceAll(new RegExp(r"\s+"), "");
    if (double.tryParse(widget.data["phone_number"]) != null) {
      phoneNumber = phoneNumberWithNoSpaces;
      phoneNumber = LocaleStorageTimeService.formatInt(int.parse(phoneNumber));
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                title: widget.data == null
                    ? ""
                    : translate(widget.data["profession"]),
          )),
        body: SingleChildScrollView(
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 33.h,horizontal: 20.w),
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
                              photo: widget.data["picture"])),
                      SizedBox(width: 17.w),
                      Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.data["name"],
                                style:  AppFonts.title8(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),),
                            SizedBox(height: 5.h),
                            DataWidget(
                                data: translate(widget.data["profession"])),
                            SizedBox(height: 3.h),
                            DataWidget(
                                data: translate(widget.data["gender"])),
                            SizedBox(height: 3.h),
                            DataWidget(
                                data: translate(widget.data["nationality"]))
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
                              "${LocaleStorageTimeService.formatInt(widget.data["salary"]["value"])} ${translate(widget.data["salary"]["currency"])}"),
                      CustomDivider(),
                      widget.data["profession"] == "Driver"
                          ? Column(children: [
                              SizedBox(height: 17.h),
                              TextLeadingRow(
                                  title: translate("license_expiration_date"),
                                  titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
                                  txt: LocaleStorageTimeService.formatDate(
                                      widget.data["license_expiry_date"]),
                                  txtStyle: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),),
                              SizedBox(height: 17.h),
                              CustomDivider()
                            ])
                          : Container(),
                      SizedBox(height: 17.h),
                      TextLeadingRow(
                          title: translate("date_of_birth"),
                          titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
                          txt: LocaleStorageTimeService.formatDate(
                              widget.data["date_of_birth"]),
                          txtStyle: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),),
                      SizedBox(height: 17.h),
                      CustomDivider(),
                      BipartiteRow(
                          leftTitle: translate("status"),
                          leftTxt: translate(widget.data["marital_status"]),
                          rightTitle: translate("age"),
                          rightTxt: LocaleStorageTimeService.formatInt(
                              getAge(widget.data["date_of_birth"]))),
                      CustomDivider(),
                      BipartiteRow(
                          leftTitle: translate("contact"),
                          leftWidget: InkWell(
                              onTap: () async {
                                if (await canLaunch("tel:$phoneNumber")) {
                                  await launch("tel:$phoneNumber");
                                } else {
                                  throw 'Could not launch $phoneNumber';
                                }
                              },
                              child:
                                  Text(phoneNumber, style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),)),
                          rightTitle: widget.data["profession"] != "Driver"
                              ? translate("children")
                              : "",
                          rightTxt: widget.data["number_of_children"] != null
                              ? LocaleStorageTimeService.formatInt(
                                  widget.data["number_of_children"])
                              : ""),
                      CustomDivider(),
                      widget.data["profession"] != "Driver"
                          ? Column(children: [
                              SizedBox(height: 17.h),
                              TextLeadingRow(
                                  title: translate("education"),
                                  titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
                                  txt: translate(widget.data["education"]),
                                  txtStyle: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),),
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
                                style: AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700)),
                            SizedBox(height: 17.h),
                            for (int i = 0;
                                i < widget.data["languages"]?.length ?? 0;
                                i++)
                              CustomChip(text: widget.data["languages"][i])
                          ]),
                      SizedBox(height: 17.h),
                      CustomDivider(),
                      SizedBox(height: 17.h),
                      TextLeadingRow(
                          title: translate("experience"),
                          titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
                          widget: widget.data["experience"].length != 0
                              ? Flexible(
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
                                                  "${translate(widget.data["experience"][i]["country"])}${widget.data["experience"][i]["institution"] != null ? " - ${widget.data["experience"][i]["institution"]}" : ""}",
                                                  style: AppFonts.title9(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.69))),
                                              Text(
                                                  "${LocaleStorageTimeService.formatDate(widget.data["experience"][i]["from"])}   -   ${widget.data["experience"][i]["in_position"] ? translate("present") : "${LocaleStorageTimeService.formatDate(widget.data["experience"][i]["to"])}"}",
                                                  style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),),
                                              SizedBox(height: 4.h)
                                            ]);
                                      })
                                ]))
                              : Text(translate("none"),
                                  style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),)),
                      SizedBox(height: 17.h),
                      CustomDivider(),
                      widget.isDriver
                          ? Container()
                          : BipartiteRow(
                              leftTitle: translate("height"),
                              leftWidget: RichText(
                                  textAlign: TextAlign.start,
                                  text: TextSpan(
                                      style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),
                                      children: <TextSpan>[
                                        TextSpan(
                                            text: LocaleStorageTimeService.formatInt(int.parse(
                                                widget.data["height"]))),
                                        TextSpan(
                                            text: translate("cm"),
                                            style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),)
                                      ])),
                              rightTitle: translate("weight"),
                              rightWidget: RichText(
                                  textAlign: TextAlign.start,
                                  text: TextSpan(
                                      style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),
                                      children: <TextSpan>[
                                        TextSpan(
                                            text: LocaleStorageTimeService.formatInt(int.parse(
                                                widget.data["weight"]))),
                                        TextSpan(
                                            text: translate("kg"),
                                            style: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),)
                                      ])),
                            ),
                      widget.isDriver ? Container() : CustomDivider(),
                      widget.isDriver ? Container() : SizedBox(height: 17.h),
                      widget.isDriver
                          ? Container()
                          : Wrap(spacing: 6.w, children: <Widget>[
                              Text(translate("skills"), style: AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700)),
                              SizedBox(height: 17.h),
                              for (int i = 0;
                                  i < widget.data["skills"]?.length ?? 0;
                                  i++)
                                CustomChip(text: widget.data["skills"][i])
                            ]),
                      widget.isDriver ? Container() : SizedBox(height: 17.h),
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
                                        style: AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700)),
                                    SizedBox(height: 17.h),
                                    Flexible(
                                        child: ListView.builder(
                                            scrollDirection: Axis.horizontal,
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
                                                  padding: EdgeInsets.only(
                                                      right: 6.w),
                                                  child: InkWell(
                                                      child: CachedNetworkImage(
                                                          imageUrl:
                                                              "http://redcassia.com:3001/attachment/${widget.data["attachments"][index]}",
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
                                                          height: 91.h,
                                                          fit:
                                                              BoxFit.contain),
                                                      onTap: () {
                                                        Navigator.push(
                                                            context,
                                                            MaterialPageRoute(
                                                                builder: (context) =>
                                                                    FullImageWrapper(
                                                                        imageProvider:
                                                                            "http://redcassia.com:3001/attachment/${widget.data["attachments"][index]}")));
                                                      }));
                                            }))
                                  ]))
                          : Container()
                    ])
              ]),
            )));
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
        style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.5)));
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
      TextLeadingRow(
          title: leftTitle,
          titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
          txt: leftTxt,
          widget: leftWidget,
          txtStyle: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),),
      SizedBox(width: 9.w),
      Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
      SizedBox(width: 9.w),
      TextLeadingRow(
          title: rightTitle,
          titleStyle:  AppFonts.title9(color: Color.fromRGBO(13, 36, 52, 1.0),fontWeight: FontWeight.w700),
          txt: rightTxt,
          widget: rightWidget,
          txtStyle: AppFonts.text9odd(color: Color.fromRGBO(9, 93, 106, 1.0)),)
    ]);
  }
}