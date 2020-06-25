import 'dart:ui';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';


class Picture extends StatelessWidget {
  const Picture(
      {Key key, @required this.height, @required this.width, this.img})
      : super(key: key);

  final double width;
  final double height;
  final String img;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(17.5),
        bottomRight: Radius.circular(17.5),
      ),
      child: Container(
        height: height,
        width: width,
        margin: EdgeInsets.only(bottom: 3.0, right: 1),
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage(PathFiles.ImgPath + img),
                fit: BoxFit.cover),
            boxShadow: [
              BoxShadow(
                  color: Color.fromRGBO(0, 0, 0, 0.15),
                  blurRadius: 10.0,
                  offset: Offset(1, 1))
            ],
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(17.5),
              bottomRight: Radius.circular(17.5),
            )),
      ),
    );
  }
}
