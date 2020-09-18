import 'dart:ui';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/screens/profile_template.dart';
import 'package:darq/views/home/shared/leading_row.dart';
import 'package:darq/views/home/style_const/home_screens_style_const.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

parseGeneralC1({String data, double rating}) {
  switch (data) {
    case 'picture':
      return Picture(height: 69.h, width: 70.w, img: "avatar.png");

    case "sized_box_7":
      return SizedBox(height: 7.h);

    case 'rating':
      return SmoothStarRating(
          allowHalfRating: true,
          onRatingChanged: (v) => rating = v,
          size: 11.67.w,
          filledIconData: Icons.star,
          halfFilledIconData: Icons.star_half,
          defaultIconData: Icons.star_border,
          starCount: 5,
          rating: rating,
          borderColor: Color(0xFFE1A854),
          color: Color(0xFFE1A854),
          spacing: 0.0);
  }
}

parseGeneralC2(
    {String data, double rating, BuildContext context, String pagePath}) {
  switch (data) {
    case 'business_name':
      return Text("Job Title Name", style: kTitle9Rgb_07);

    case 'business_type':
      return Text("Job subtitle", style: kTitle11OddRgb_05);

    case "sized_box_3":
      return SizedBox(height: 3.h);

    case 'description':
      return Text(
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC..",
          style: AppFonts.text10w500(color: Color.fromRGBO(0, 0, 0, 0.37)));

    case "sized_box_2":
      return SizedBox(height: 2.h);

    case "view_details":
      return GestureDetector(
        onTap: () =>
            Navigator.push(context, MaterialPageRoute(builder: (context) {
          return ProfileTemplate(jsonFile: pagePath);
        })),
        child: Text("View Details..",
            style: AppFonts.title11Odd(color: Color(0xFFE1A854))),
      );

    case "sized_box_10":
      return SizedBox(height: 10.h);

    case "contact_us":
      return Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: "Contact Us",
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title11Odd(color: Colors.white),
            onButtonPressed: () => {})
      ]);

    case "contact_me":
      return Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: "Contact Me",
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title11Odd(color: Colors.white),
            onButtonPressed: () => {})
      ]);

    case "sized_box_6":
      return SizedBox(height: 6.h);

    case "sized_box_9":
      return SizedBox(height: 9.h);

    case "sized_box_7":
      return SizedBox(height: 7.h);

    case 'address_text':
      return Text("Alexandria, Egypt",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case 'time_text':
      return Text("9:00 AM - 11:00 AM",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case 'business_type_text':
      return Text("Conference",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case "sized_box_5_56":
      return SizedBox(height: 5.56.h);

    case "text_leading_address":
      return TextLeadingRow(
          title: "Address: ",
          txt: "Alexandria, Egypt",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case "text_leading_founded":
      return TextLeadingRow(
          title: "Founded: ",
          txt: "2012",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case "text_leading_curriculum":
      return TextLeadingRow(
          title: "Curriculum: ",
          txt: "Canadian, British",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));
  }
}
