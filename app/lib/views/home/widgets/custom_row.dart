import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:darq/elements/app_fonts.dart';


class CustomRow extends StatelessWidget {
  const CustomRow({Key key, @required this.title, @required this.txt})
      : super(key: key);

  final String title;
  final String txt;
  @override
  Widget build(BuildContext context) {
    return Row(children: <Widget>[
      Text(title, style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7))),
      Text(txt, style: AppFonts.text9(color: Color.fromRGBO(0, 0, 0, 0.7)))
    ]);
  }
}
