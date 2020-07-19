import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
import 'package:darq/views/home/shared/txt_leading_row.dart';
import 'package:darq/views/home/style_const/home_screens_style_const.dart';
import 'package:darq/views/shared/buttons/button.dart';
import 'package:darq/views/home/screens/profile_template.dart';


parseGeneralC1({int index, double rating}) {
  switch (global.generalC1[index]) {
    case 'picture':
      global.generalC1[index] =
          Picture(height: 69.h, width: 70.w, img: "avatar.png");
      break;

    case "sized_box_7":
      global.generalC1[index] = SizedBox(height: 7.h);
      break;
    case 'rating':
      global.generalC1[index] = SmoothStarRating(
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
      break;
  }
}

parseGeneralC2({int index, double rating, BuildContext context, String pagePath}) {
  switch (global.generalC2[index]) {
    case 'business_name':
      global.generalC2[index] = Text("Job Title Name", style: kTitle9Rgb_07);
      break;
    case 'business_type':
      global.generalC2[index] = Text("Job subtitle", style: kTitle11OddRgb_05);
      break;
    case "sized_box_3":
      global.generalC2[index] = SizedBox(height: 3.h);
      break;
    case 'description':
      global.generalC2[index] = Text(
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC..",
          style: AppFonts.text10w500(color: Color.fromRGBO(0, 0, 0, 0.37)));
      break;
    case "sized_box_2":
      global.generalC2[index] = SizedBox(height: 2.h);
      break;
    case "view_details":
      global.generalC2[index] = GestureDetector(
        onTap: ()=>
            Navigator.push(context, MaterialPageRoute(builder: (context) {
              return ProfileTemplate(jsonFile: pagePath);
            }))
        ,
        child: Text("View Details..",
            style: AppFonts.title11Odd(color: Color(0xFFE1A854))),
      );
      break;
    case "sized_box_10":
      global.generalC2[index] = SizedBox(height: 10.h);
      break;
    case "contact_us":
      global.generalC2[index] =
          Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: "Contact Us",
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title11Odd(color: Colors.white),
            onButtonPressed: () => {})
      ]);
      break;
    case "contact_me":
      global.generalC2[index] =
          Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: "Contact Me",
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title11Odd(color: Colors.white),
            onButtonPressed: () => {})
      ]);
      break;
    case "sized_box_6":
      global.generalC2[index] = SizedBox(height: 6.h);
      break;
    case "sized_box_9":
      global.generalC2[index] = SizedBox(height: 9.h);
      break;
    case "sized_box_7":
      global.generalC2[index] = SizedBox(height: 7.h);
      break;
    case 'address_text':
      global.generalC2[index] = Text("Alexandria, Egypt",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
    case 'time_text':
      global.generalC2[index] = Text("9:00 AM - 11:00 AM",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
    case 'business_type_text':
      global.generalC2[index] = Text("Conference",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
    case "sized_box_5_56":
      global.generalC2[index] = SizedBox(height: 5.56.h);
      break;
    case "text_leading_address":
      global.generalC2[index] = TextLeadingRow(
          title: "Address: ",
          txt: "Alexandria, Egypt",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
    case "text_leading_founded":
      global.generalC2[index] = TextLeadingRow(
          title: "Founded: ",
          txt: "2012",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
    case "text_leading_curriculum":
      global.generalC2[index] = TextLeadingRow(
          title: "Curriculum: ",
          txt: "Canadian, British",
          titleStyle: AppFonts.title11(color: Color.fromRGBO(0, 0, 0, 0.7)),
          txtStyle: AppFonts.text10(color: Color.fromRGBO(0, 0, 0, 0.7)));
      break;
  }
}
