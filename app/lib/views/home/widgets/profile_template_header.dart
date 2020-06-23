import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/shared/custom_tile/horizontal_tile/tile_content_leading.dart';
import 'package:darq/views/home/widgets/profile_template.dart';
import 'package:darq/views/home/widgets/icon_leading_row.dart';

class Header extends StatelessWidget {
  const Header({
    Key key,
    @required this.rating,
    @required this.widget,
    this.onRatingClicked,
  }) : super(key: key);

  final double rating;
  final ProfileTemplate widget;
  final Function(double) onRatingClicked;

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Row(crossAxisAlignment: CrossAxisAlignment.start, children: <Widget>[
        TileContentLeading(
            imgWidth: 80.w,
            imgHeight: 80.w,
            profilePic: "avatar.png",
            rating: rating,
            onRatingChange: (v) => {onRatingClicked(v)}),
        SizedBox(width: 17.w),
        Expanded(
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text("Job Title Name",
                      style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.7))),
                  Text("Job subtitle",
                      style:
                      AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5))),
                  widget.title == "Self Employed"
                      ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      SizedBox(height: 4.h),
                      Text("Male",
                          style: AppFonts.title10Odd(
                              color: Color.fromRGBO(0, 0, 0, 0.5))),
                      SizedBox(height: 5.h),
                      Text("Syrian",
                          style: AppFonts.title10Odd(
                              color: Color.fromRGBO(0, 0, 0, 0.5))),
                    ],
                  )
                      : Container(),
                  SizedBox(height: 4.h),
                  IconLeadingRow(
                      imgName: "address.png", txt: "Smouha, Elnasr St. alexandria"),
                  SizedBox(height: widget.title == "Self Employed" ? 0 : 6.h),
                  widget.title == "Self Employed"
                      ? Container()
                      : IconLeadingRow(
                      imgName: "clock.png", txt: "7:00 am - 10:pm"),
                  SizedBox(height: 5.h),
                  IconLeadingRow(
                      imgName: "telephone.png",
                      txt: "Show Number",
                      textStyle:
                      AppFonts.title10OddUnderlined(color: Color(0xFF426676)))
                ]))
      ]),
      SizedBox(height: 9.h),
      Text(
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
          style: AppFonts.text6w500(color: Color.fromRGBO(0, 0, 0, 0.69)))
    ]);
  }
}