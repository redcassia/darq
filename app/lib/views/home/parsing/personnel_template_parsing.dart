import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/home/shared/custom_divider.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/home/shared/full_img_wrapper.dart';
import 'package:darq/views/home/shared/txt_leading_row.dart';
import 'package:darq/views/home/style_const/home_screens_style_const.dart';
import 'package:darq/views/shared/custom_chip.dart';

parsePersonnelC1({String data}) {
  switch (data) {
    case 'picture':
      return Picture(height: 79.h, width: 80.w, img: "avatar.png");
  }
}

parsePersonnelC2({String data}) {
  switch (data) {
    case "sized_box_7":
      return SizedBox(height: 7.h);
      
    case "sized_box_10":
      return SizedBox(height: 10.h);
      

    case 'personnel_name':
      return Text("Job Title Name", style: kTitle9Rgb_67);
      
    case 'job_type':
      return
          Text("Job subtitle", style: kTitle11OddRgb_05);
      
    case 'gender':
      return Text("Male", style: kTitle11OddRgb_05);
      
    case 'nationality':
      return Text("Syrian", style: kTitle11OddRgb_05);
      
  }
}

parsePersonnelC3({String data, BuildContext context}) {
  switch (data) {
    case "sized_box_14":
      return SizedBox(height: 14.h);
      
    case "sized_box_17":
      return SizedBox(height: 17.h);
      
    case "divider":
      return CustomDivider();
      
    case 'application_number':
      return TextLeadingRow(
          title: "Application Number:",
          titleStyle: kTitle9Rgb_67,
          txt: "225",
          txtStyle: kText9OddRgb_05);
      
    case 'religion_salary':
      return Row(children: [
        SizedBox(
            width: 147.w,
            child: TextLeadingRow(
                title: "Religion:",
                titleStyle: kTitle9Rgb_67,
                txt: "Christian",
                txtStyle: kText9OddRgb_05)),
        Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
        SizedBox(width: 10.w),
        TextLeadingRow(
            title: "Salary:",
            titleStyle: kTitle9Rgb_67,
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(style: kText9OddRgb_05, children: <TextSpan>[
                  TextSpan(text: "400"),
                  TextSpan(
                      text: " \$",
                      style:
                          AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)))
                ])))
      ]);
      
    case 'date_of_birth':
      return TextLeadingRow(
          title: "Date of Birth:",
          titleStyle: kTitle9Rgb_67,
          txt: "December 18, 1989",
          txtStyle: kText9OddRgb_05);
      
    case 'license_exp_date':
      return TextLeadingRow(
          title: "License Expiration Date:",
          titleStyle: kTitle9Rgb_67,
          txt: "Jan 2020",
          txtStyle: kText9OddRgb_05);
      
    case 'status_age':
      return Row(children: [
        SizedBox(
          width: 147.w,
          child: TextLeadingRow(
              title: "Status:",
              titleStyle: kTitle9Rgb_67,
              txt: "Marries",
              txtStyle: kText9OddRgb_05),
        ),
        Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
        SizedBox(width: 10.w),
        TextLeadingRow(
            title: "Age:",
            titleStyle: kTitle9Rgb_67,
            txt: "31",
            txtStyle: kText9OddRgb_05)
      ]);
      
    case 'contact_kids':
      return Row(children: [
        SizedBox(
          width: 147.w,
          child: TextLeadingRow(
              title: "Contact:",
              titleStyle: kTitle9Rgb_67,
              txt: "2",
              txtStyle: kText9OddRgb_05),
        ),
        Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
        SizedBox(width: 10.w),
        TextLeadingRow(
            title: "Kids:",
            titleStyle: kTitle9Rgb_67,
            txt: "3",
            txtStyle: kText9OddRgb_05)
      ]);
      
    case 'contact':
      return Row(children: [
        SizedBox(
          width: 147.w,
          child: TextLeadingRow(
              title: "Contact:",
              titleStyle: kTitle9Rgb_67,
              txt: "2",
              txtStyle: kText9OddRgb_05),
        ),
        Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
      ]);
      
    case 'education':
      return TextLeadingRow(
          title: "Education:",
          titleStyle: kTitle9Rgb_67,
          txt: "High School",
          txtStyle: kText9OddRgb_05);
      
    case 'languages':
      return TextLeadingRow(
          title: "Languages:",
          titleStyle: kTitle9Rgb_67,
          widget: Flexible(
            child: Column(
              children: [
                SizedBox(height: 3.h),
                GridView.count(
                    physics: NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    crossAxisCount: 4,
                    padding: EdgeInsets.zero,
                    children: List.generate(2, (index) {
                      return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("English",
                                style: AppFonts.title11Odd(
                                    color: Color.fromRGBO(0, 0, 0, 0.69))),
                            SizedBox(height: 3.h),
                            Text("Excellent",
                                style: AppFonts.text9odd(
                                    color: Color.fromRGBO(0, 0, 0, 0.5)))
                          ]);
                    })),
              ],
            ),
          ));
      
    case 'years_of_exp':
      return TextLeadingRow(
          title: "Experience:",
          titleStyle: kTitle9Rgb_67,
          widget: Flexible(
              child: Column(children: <Widget>[
            SizedBox(height: 3.h),
            ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: 3,
                itemBuilder: (BuildContext context, int index) {
                  return Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text("In Saudi",
                            style: AppFonts.title11Odd(
                                color: Color.fromRGBO(0, 0, 0, 0.69))),
                        Text("2018 - 2020 ",
                            style: AppFonts.text9odd(
                                color: Color.fromRGBO(0, 0, 0, 0.5))),
                        SizedBox(height: 4.h)
                      ]);
                })
          ])));
      
    case 'height_weight':
      return Row(children: [
        SizedBox(
            width: 147.w,
            child: TextLeadingRow(
                title: "Height:",
                titleStyle: kTitle9Rgb_67,
                widget: RichText(
                    textAlign: TextAlign.start,
                    text: TextSpan(style: kText9OddRgb_05, children: <TextSpan>[
                      TextSpan(text: "5'0\""),
                      TextSpan(
                          text: "ft",
                          style: AppFonts.title10(
                              color: Color.fromRGBO(0, 0, 0, 0.7)))
                    ])))),
        Container(height: 45.h, width: 1.5.h, color: Color(0xFFE5E5E5)),
        SizedBox(width: 10.w),
        TextLeadingRow(
            title: "Kids:",
            titleStyle: kTitle9Rgb_67,
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(style: kText9OddRgb_05, children: <TextSpan>[
                  TextSpan(text: "54"),
                  TextSpan(
                      text: "kg",
                      style:
                          AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)))
                ])))
      ]);
      
    case 'skills':
      return Wrap(spacing: 6.w, children: <Widget>[
        Text("Skills:", style: kTitle9Rgb_67),
        SizedBox(height: 17.h),
        for (int i = 0; i < 4; i++) CustomChip(text: "TeamWork")
      ]);
      
    case 'photos':
      return SizedBox(
          height: 125.h,
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Photos",
                  style: kTitle9Rgb_67,
                ),
                SizedBox(height: 17.h),
                Flexible(
                    child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        padding: EdgeInsets.zero,
                        itemCount: 3,
                        itemBuilder: (BuildContext context, int index) {
                          return Padding(
                              padding: EdgeInsets.only(right: 6.w),
                              child: InkWell(
                                  child: Image(
                                    width: 141.w,
                                    height: 101.h,
                                    fit: BoxFit.cover,
                                    image: AssetImage(
                                        PathFiles.ImgPath + "gallery.png"),
                                  ),
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => FullImageWrapper(
                                                imageProvider: AssetImage(
                                                    "assets/images/gallery.png"))));
                                  }));
                        }))
              ]));
      
  }
}
