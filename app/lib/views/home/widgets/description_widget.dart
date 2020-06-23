import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/widgets/custom_row.dart';

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
      CustomRow(title: "Address: ", txt: address),
      CustomRow(title: "Founded: ", txt: founded),
      CustomRow(title: "Curriculum: ", txt: curriculum)
    ]);
  }
}