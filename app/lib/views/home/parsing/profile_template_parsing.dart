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
import 'package:darq/views/home/shared/icon_leading_row.dart';
import 'package:darq/views/home/shared/full_img_wrapper.dart';
import 'package:darq/views/home/variables/home_screens_variables.dart'
    as global;
import 'package:darq/views/home/shared/txt_leading_row.dart';
import 'package:darq/views/home/style_const/home_screens_style_const.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/home/screens/domestic_personnel_template.dart';

parseC1({int index, rating}) {
  switch (global.col1[index]) {
    case 'picture':
      global.col1[index] =
          Picture(height: 79.h, width: 80.w, img: "avatar.png");
      break;

    case "sized_box_6":
      global.col1[index] = SizedBox(height: 6.h);
      break;
    case 'rating':
      global.col1[index] = SmoothStarRating(
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
      break;
  }
}

parseC2({int index}) {
  switch (global.col2[index]) {
    case "sized_box_6":
      global.col2[index] = SizedBox(height: 6.h);
      break;
    case "sized_box_5":
      global.col2[index] = SizedBox(height: 5.h);
      break;
    case "sized_box_4":
      global.col2[index] = SizedBox(height: 4.h);
      break;
    case "sized_box_5_86":
      global.col2[index] = SizedBox(height: 5.86.h);
      break;
    case 'business_name':
      global.col2[index] = Text("Job Title Name", style: kTitle9Rgb_07);
      break;

    case 'business_type':
      global.col2[index] = Text("Job subtitle", style: kTitle11OddRgb_05);
      break;

    case 'gender':
      global.col2[index] = Text("Male", style: kTitle11OddRgb_05);
      break;

    case 'nationality':
      global.col2[index] = Text("Syrian", style: kTitle11OddRgb_05);
      break;

    case 'address':
      global.col2[index] = IconLeadingRow(
          iconName: "address.png",
          txt: "Alexandria, Egypt",
          textStyle: kTitle11OddRgb_05);
      break;

    case 'time':
      global.col2[index] = IconLeadingRow(
          iconName: "clock.png",
          txt: "7:00 am - 10:pm",
          textStyle: kTitle11OddRgb_05);
      break;

    case 'number':
      global.col2[index] = IconLeadingRow(
          iconName: "telephone.png",
          txt: "Show Number",
          textStyle: kTitle10UnderLined);
      break;
  }
}

parseC3({int index, BuildContext context}) {
  switch (global.col3[index]) {
    case "sized_box_17":
      global.col3[index] = SizedBox(height: 17.h);
      break;
    case "sized_box_9":
      global.col3[index] = SizedBox(height: 9.h);
      break;
    case "divider":
      global.col3[index] = CustomDivider();
      break;

    case 'description':
      global.col3[index] = Text(
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
          style: AppFonts.text6w500(color: Color.fromRGBO(0, 0, 0, 0.69)));
      break;
    case 'skills':
      global.col3[index] = Wrap(
        spacing: 6.w,
        children: <Widget>[
          Text("Skills:", style: kTitle9Rgb_67),
          SizedBox(height: 17.h),
          for (int i = 0; i < 4; i++) CustomChip(text: "TeamWork"),
        ],
      );
      break;
    case 'experience':
      global.col3[index] = TextLeadingRow(
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

      break;
    case 'salary':
      global.col3[index] = TextLeadingRow(
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

      break;
    case 'founded':
      global.col3[index] = TextLeadingRow(
        title: "Founded:",
        titleStyle: kTitle9Rgb_67,
        txt: "2012",
        txtStyle: kText9OddRgb_05,
      );

      break;
    case 'curriculum':
      global.col3[index] = TextLeadingRow(
        title: "Curriculum:",
        titleStyle: kTitle9Rgb_67,
        txt: "Canadian, British",
        txtStyle: kText9OddRgb_05,
      );

      break;
    case 'duration':
      global.col3[index] = Row(children: <Widget>[
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
      break;
    case 'reservation':
      global.col3[index] = TextLeadingRow(
          title: "Ticket Reservation:",
          titleStyle: kTitle9Rgb_67,
          txt: "Official website",
          txtStyle: kText9OddRgb_05);
      break;
    case 'price':
      global.col3[index] = TextLeadingRow(
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

      break;
    case 'organizer':
      global.col3[index] = TextLeadingRow(
        title: "Organizer:",
        titleStyle: kTitle9Rgb_67,
        txt: "AUC",
        txtStyle: kText9OddRgb_05,
      );
      break;
    case 'profile':
      global.col3[index] = Padding(
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
                        padding: EdgeInsets.only(
                            top: 6.h, left: 10.w, right: 9.w),
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
      break;

    case 'home_service':
      global.col3[index] = TextLeadingRow(
        title: "Home Service:",
        titleStyle: kTitle9Rgb_67,
        txt: "Available",
        txtStyle: AppFonts.title11Odd(color: Color(0xFFE1A854)),
      );
      break;
    case 'services':
      global.col3[index] = Column(
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
      break;
    case 'website':
      global.col3[index] = TextLeadingRow(
          title: "Website:",
          titleStyle: kTitle9Rgb_67,
          txt: "www.google.com",
          txtStyle: AppFonts.text9odd(color: Color(0xFF426676)));

      break;
    case 'products':
      global.col3[index] = Column(
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
      break;
    case 'classes':
      global.col3[index] = Column(
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
      break;
    case 'owner':
      global.col3[index] = TextLeadingRow(
        title: "Owner:",
        titleStyle: kTitle9Rgb_67,
        txt: "Hamad ali",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );

      break;
    case 'teams':
      global.col3[index] = Column(
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
                      SizedBox(height: 3.h),
                    ],
                  );
                }),
          ]);
      break;
    case 'menu':
      global.col3[index] = Column(
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
      break;
    case 'photos':
      global.col3[index] = SizedBox(
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
      break;
  }
}
