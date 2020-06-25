import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/widgets/txt_leading_row.dart';

class UntitledDescription extends StatelessWidget {
  const UntitledDescription(
      {@required this.address,
        @required this.subtitle,
        @required this.time,
        Key key})
      : super(key: key);

  final String address;
  final String time;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(address,
              style: AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.7))),
          Text(time,
              style: AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.7))),
          Text(subtitle,
              style: AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.7)))
        ]);
  }
}

class TitledDescription extends StatelessWidget {
  const TitledDescription(
      {@required this.address,
        @required this.founded,
        @required this.curriculum,
        Key key})
      : super(key: key);

  final String address;
  final String founded;
  final String curriculum;

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      TextLeadingRow(title: "Address: ", txt: address ,titleStyle: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)),txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7))),
      TextLeadingRow(title: "Founded: ", txt: founded,titleStyle: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)),txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7))),
      TextLeadingRow(title: "Curriculum: ", txt: curriculum,titleStyle: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)),txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)))
    ]);
  }
}

