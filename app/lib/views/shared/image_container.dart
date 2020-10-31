import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/utilities/constants.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class Picture extends StatelessWidget {
  const Picture(
      {Key key,
      @required this.height,
      @required this.width,
      this.img,
      this.internetImg = false})
      : super(key: key);

  final double width;
  final double height;
  final String img;
  final bool internetImg;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: Localizations.localeOf(context).languageCode == 'en'
            ? BorderRadius.only(
                topLeft: Radius.circular(17.5),
                bottomRight: Radius.circular(17.5))
            : BorderRadius.only(
                topRight: Radius.circular(17.5),
                bottomLeft: Radius.circular(17.5)),
        child: Container(
            height: height,
            width: width,
            margin: EdgeInsets.only(
                bottom: ConsDimensions.ImageBottomShadow,
                right: ConsDimensions.ImageRightShadow),
            decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.15),
                      blurRadius: 10.0,
                      offset: Offset(1, 1))
                ],
                borderRadius:
                    Localizations.localeOf(context).languageCode == 'en'
                        ? BorderRadius.only(
                            topLeft: Radius.circular(17.5),
                            bottomRight: Radius.circular(17.5))
                        : BorderRadius.only(
                            topRight: Radius.circular(17.5),
                            bottomLeft: Radius.circular(17.5))),
            child: FittedBox(
                fit: BoxFit.cover,
                child: CachedNetworkImage(
                    imageUrl: "http://redcassia.com:3001/attachment/$img",
                    placeholder: (context, url) => CircularProgressIndicator(),
                    errorWidget: (context, url, error) => Icon(Icons.error)))));
  }
}
