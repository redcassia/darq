import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/home/shared/custom_divider.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:darq/views/home/shared/full_img_wrapper.dart';
import 'package:darq/views/home/shared/leading_row.dart';
import 'package:darq/views/home/style_const/home_screens_style_const.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/home/screens/domestic_personnel_template.dart';

parseC1({String data, rating}) {
  switch (data) {
    case 'picture':
      return Picture(height: 79.h, width: 80.w, img: "avatar.png");

    case "sized_box_6":
      return SizedBox(height: 6.h);

    case 'rating':
      return SmoothStarRating(
          allowHalfRating: true,
          onRatingChanged: (v) => rating = v,
          size: 14.w,
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

parseC2({String data}) {
  switch (data) {
    case "sized_box_6":
      return SizedBox(height: 6.h);

    case "sized_box_5":
      return SizedBox(height: 5.h);

    case "sized_box_4":
      return SizedBox(height: 4.h);

    case "sized_box_5_86":
      return SizedBox(height: 5.86.h);

    case 'business_name':
      return Text("Job Title Name", style: kTitle9Rgb_07);

    case 'business_type':
      return Text("Job subtitle", style: kTitle11OddRgb_05);

    case 'gender':
      return Text("Male", style: kTitle11OddRgb_05);

    case 'nationality':
      return Text("Syrian", style: kTitle11OddRgb_05);

    case 'address':
      return IconLeadingRow(
          iconName: "address.png",
          txt: "Alexandria, Egypt",
          textStyle: kTitle11OddRgb_05);

    case 'time':
      return IconLeadingRow(
          iconName: "clock.png",
          txt: "7:00 am - 10:pm",
          textStyle: kTitle11OddRgb_05);

    case 'number':
      return IconLeadingRow(
          iconName: "telephone.png",
          txt: "Show Number",
          textStyle: kTitle10UnderLined);
  }
}

parseC3({String data, BuildContext context}) {
  switch (data) {
    case "sized_box_17":
      return SizedBox(height: 17.h);

    case "sized_box_9":
      return SizedBox(height: 9.h);

    case "divider":
      return CustomDivider();

    case 'description':
      return Text(
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
          style: AppFonts.text6w500(color: Color.fromRGBO(0, 0, 0, 0.69)));

    case 'skills':
      return Wrap(
        spacing: 6.w,
        children: <Widget>[
          Text("Skills:", style: kTitle9Rgb_67),
          SizedBox(height: 17.h),
          for (int i = 0; i < 4; i++) CustomChip(text: "TeamWork"),
        ],
      );

    case 'experience':
      return TextLeadingRow(
        title: "Experience:",
        titleStyle: kTitle9Rgb_67,
        widget: Flexible(
          child: Column(
            children: <Widget>[
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
                          Text("World Gym",
                              style: AppFonts.title11Odd(
                                  color: Color.fromRGBO(0, 0, 0, 0.69))),
                          Text("sep 2019 - present",
                              style: AppFonts.text9odd(
                                  color: Color.fromRGBO(0, 0, 0, 0.5))),
                          SizedBox(height: 4.h),
                        ]);
                  }),
            ],
          ),
        ),
      );

    case 'salary':
      return TextLeadingRow(
          title: "Salary:",
          titleStyle: kTitle9Rgb_67,
          widget: RichText(
              textAlign: TextAlign.start,
              text: TextSpan(
                  style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)),
                  children: <TextSpan>[
                    TextSpan(text: "30\$"),
                    TextSpan(
                        text: " /hr",
                        style: AppFonts.title10(
                            color: Color.fromRGBO(0, 0, 0, 0.5)))
                  ])));

    case 'founded':
      return TextLeadingRow(
        title: "Founded:",
        titleStyle: kTitle9Rgb_67,
        txt: "2012",
        txtStyle: kText9OddRgb_05,
      );

    case 'curriculum':
      return TextLeadingRow(
        title: "Curriculum:",
        titleStyle: kTitle9Rgb_67,
        txt: "Canadian, British",
        txtStyle: kText9OddRgb_05,
      );

    case 'duration':
      return Row(children: <Widget>[
        TextLeadingRow(
            title: "Start:",
            titleStyle: kTitle9Rgb_67,
            txt: "9 May 2020",
            txtStyle: kText9OddRgb_05),
        SizedBox(width: 53.w),
        TextLeadingRow(
            title: "End:",
            titleStyle: kTitle9Rgb_67,
            txt: "12 May 2020",
            txtStyle: kText9OddRgb_05)
      ]);

    case 'reservation':
      return TextLeadingRow(
          title: "Ticket Reservation:",
          titleStyle: kTitle9Rgb_67,
          txt: "Official website",
          txtStyle: kText9OddRgb_05);

    case 'price':
      return TextLeadingRow(
        title: "Ticket Price:",
        titleStyle: kTitle9Rgb_67,
        widget: RichText(
            textAlign: TextAlign.start,
            text: TextSpan(style: kText9OddRgb_05, children: <TextSpan>[
              TextSpan(text: "30"),
              TextSpan(
                  text: " \$",
                  style: AppFonts.title10(color: Color.fromRGBO(0, 0, 0, 0.7)))
            ])),
      );

    case 'organizer':
      return TextLeadingRow(
        title: "Organizer:",
        titleStyle: kTitle9Rgb_67,
        txt: "AUC",
        txtStyle: kText9OddRgb_05,
      );

    case 'profile':
      return Padding(
          padding: EdgeInsets.only(left: 24.w, right: 28.w),
          child: GridView.count(
              physics: NeverScrollableScrollPhysics(),
              crossAxisSpacing: 30.w,
              mainAxisSpacing: 17.h,
              shrinkWrap: true,
              crossAxisCount: 2,
              children: List.generate(13, (index) {
                return GestureDetector(
                    onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => DomesticPersonnelTemplate(
                                jsonFile: "default_personnel.json"))),
                    child: DefaultCard(
                        margin: EdgeInsets.zero,
                        padding:
                            EdgeInsets.only(top: 6.h, left: 10.w, right: 9.w),
                        color: Color(0xFFF5F9FA),
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Picture(
                                  height: 43.h, width: 44.w, img: "avatar.png"),
                              SizedBox(height: 6.h),
                              Text("Ahmed Mohamed",
                                  style: AppFonts.title11Odd(
                                      color: Color(0xFF545454))),
                              Text("Syrian",
                                  style: AppFonts.title11Odd(
                                      color: Color.fromRGBO(0, 0, 0, 0.5))),
                              Text("Driver",
                                  style: AppFonts.text10w500(
                                      color: Color.fromRGBO(0, 0, 0, 0.37))),
                            ])));
              })));

    case 'home_service':
      return TextLeadingRow(
        title: "Home Service:",
        titleStyle: kTitle9Rgb_67,
        txt: "Available",
        txtStyle: AppFonts.title11Odd(color: Color(0xFFE1A854)),
      );

    case 'services':
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text("Services:", style: kTitle9Rgb_67),
          SizedBox(height: 5.h),
          ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              padding: EdgeInsets.zero,
              itemCount: 3,
              itemBuilder: (BuildContext context, int index) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text("- Skin Care", style: kText9OddRgb_05),
                    SizedBox(height: 3.h),
                  ],
                );
              }),
        ],
      );

    case 'website':
      return TextLeadingRow(
          title: "Website:",
          titleStyle: kTitle9Rgb_67,
          txt: "www.google.com",
          txtStyle: AppFonts.text9odd(color: Color(0xFF426676)));

    case 'products':
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Products:",
            style: kTitle9Rgb_67,
          ),
          SizedBox(height: 5.h),
          ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              padding: EdgeInsets.zero,
              itemCount: 3,
              itemBuilder: (BuildContext context, int index) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text("- Honey", style: kText9OddRgb_05),
                    SizedBox(height: 3.h),
                  ],
                );
              }),
        ],
      );

    case 'classes':
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text("Classes:", style: kTitle9Rgb_67),
          SizedBox(height: 5.h),
          ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              padding: EdgeInsets.zero,
              itemCount: 3,
              itemBuilder: (BuildContext context, int index) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text("- Skin Care", style: kText9OddRgb_05),
                    SizedBox(height: 3.h),
                  ],
                );
              }),
        ],
      );

    case 'owner':
      return TextLeadingRow(
        title: "Owner:",
        titleStyle: kTitle9Rgb_67,
        txt: "Hamad ali",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );

    case 'teams':
      return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "Teams:",
              style: kTitle9Rgb_67,
            ),
            SizedBox(height: 5.h),
            ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: 3,
                itemBuilder: (BuildContext context, int index) {
                  return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text("- The Kings", style: kText9OddRgb_05),
                        SizedBox(height: 3.h)
                      ]);
                })
          ]);
    case "activities":
      return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text("Activities:", style: kTitle9Rgb_67),
            SizedBox(height: 5.h),
            ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: 3,
                itemBuilder: (BuildContext context, int index) {
                  return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text("- The Kings", style: kText9OddRgb_05),
                        SizedBox(height: 3.h)
                      ]);
                })
          ]);
    case 'menu':
      return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text("Menu:", style: kTitle9Rgb_67),
            SizedBox(height: 11.h),
            InkWell(
                child: Image(
                  image: AssetImage(PathFiles.ImgPath + "gallery.png"),
                ),
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => FullImageWrapper(
                                imageProvider:
                                    AssetImage("assets/images/gallery.png"),
                              )));
                })
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
                          image: AssetImage(PathFiles.ImgPath + "gallery.png"),
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => FullImageWrapper(
                                imageProvider:
                                    AssetImage("assets/images/gallery.png"),
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  }),
            )
          ],
        ),
      );
  }
}

