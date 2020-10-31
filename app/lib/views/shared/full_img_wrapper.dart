import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class FullImageWrapper extends StatelessWidget {
  const FullImageWrapper({
    this.imageProvider,
  });

  final String imageProvider;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(children: [
      Container(
          constraints:
              BoxConstraints.expand(height: MediaQuery.of(context).size.height),
          child: CachedNetworkImage(
              imageUrl: imageProvider,
              placeholder: (context, url) => CircularProgressIndicator(),
              errorWidget: (context, url, error) => Icon(Icons.error),
              filterQuality: FilterQuality.high,
              fit: BoxFit.contain)),
      Positioned(
          top: 40.h,
          left: 5.w,
          child: GestureDetector(
              child: Icon(Icons.close, color: Colors.black, size: 35.w),
              onTap: () => Navigator.pop(context)))
    ]));
  }
}
