import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/home/widgets/custom_divider.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:darq/views/home/widgets/icon_leading_row.dart';
import 'package:darq/views/home/widgets/img_wrapper.dart';
import 'package:darq/views/home/widgets/profile_lists_variables.dart' as global;
import 'package:darq/views/home/widgets/txt_leading_row.dart';
import 'package:darq/views/home/widgets/style_const.dart';
import 'package:darq/views/shared/custom_chip.dart';

parseC1({int index, rating}) {
  switch (global.col1[index]) {
    case 'picture':
      global.col1[index] =
          Picture(height: 80.w, width: 80.w, img: "avatar.png");
      break;

    case "sized_box_9":
      global.col1[index] = SizedBox(height: 9.h);
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
      global.col2[index] =
          Text("Job Title Name", style: kProfileHeaderTitle9Rgb_07);
      break;

    case 'business_type':
      global.col2[index] =
          Text("Job subtitle", style: kProfileHeaderTitle10OddRgb_05);
      break;

    case 'gender':
      global.col2[index] = Text("Male", style: kProfileHeaderTitle10OddRgb_05);
      break;

    case 'nationality':
      global.col2[index] =
          Text("Syrian", style: kProfileHeaderTitle10OddRgb_05);
      break;

    case 'address':
      global.col2[index] = IconLeadingRow(
          imgName: "address.png",
          txt: "Doha, Qatar",
          textStyle: kProfileHeaderTitle10OddRgb_05);
      break;

    case 'time':
      global.col2[index] = IconLeadingRow(
          imgName: "clock.png",
          txt: "7:00 am - 10:pm",
          textStyle: kProfileHeaderTitle10OddRgb_05);
      break;

    case 'number':
      global.col2[index] = IconLeadingRow(
          imgName: "telephone.png",
          txt: "Show Number",
          textStyle: kProfileHeaderTitle10UnderLined);
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
          Text("Skills:", style: kProfileHeaderTitle9Rgb_67),
          SizedBox(height: 17.h),
          for (int i = 0; i < 4; i++) CustomChip(text: "TeamWork"),
        ],
      );
      break;
    case 'experience':
      global.col3[index] = TextLeadingRow(
          title: "Experience:",
          titleStyle: kProfileHeaderTitle9Rgb_67,
          txtWidget: Flexible(
            child: ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: 3,
                itemBuilder: (BuildContext context, int index) {
                  return Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          "World Gym",
                          style: AppFonts.title10Odd(
                              color: Color.fromRGBO(0, 0, 0, 0.69)),
                        ),
                        Text("sep 2019 - present",
                            style: AppFonts.text9odd(
                                color: Color.fromRGBO(0, 0, 0, 0.5))),
                        SizedBox(height: 6.h)
                      ]);
                }),
          ));

      break;
    case 'salary':
      global.col3[index] = TextLeadingRow(
        title: "Salary:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
        txt: "50/hr",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );

      break;
    case 'founded':
      global.col3[index] = TextLeadingRow(
        title: "Founded:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
        txt: "2012",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );

      break;
    case 'curriculum':
      global.col3[index] = TextLeadingRow(
        title: "Curriculum:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
        txt: "Canadian, British",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );

      break;
    case 'duration':
      global.col3[index] = Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            children: <Widget>[
              Text(
                "Start:",
                style: kProfileHeaderTitle9Rgb_67,
              ),
              Text("9 May 2020")
            ],
          ),
          Row(
            children: <Widget>[
              Text(
                "End:",
                style: kProfileHeaderTitle9Rgb_67,
              ),
              Text("12 May 2020")
            ],
          ),
        ],
      );
      break;
    case 'reservation':
      global.col3[index] = Row(
        children: <Widget>[
          Text(
            "Ticket Reservation:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("Official website")
        ],
      );
      break;
    case 'price':
      global.col3[index] = Row(
        children: <Widget>[
          Text(
            "Ticket Price:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("30 \$"),
        ],
      );
      break;
    case 'organizer':
      global.col3[index] = TextLeadingRow(
        title: "Organizer:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
        txt: "AUC",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );
      break;
    case 'profile':
      global.col3[index] = Text("A profile should be shown here");
      break;

    case 'home_service':
      global.col3[index] = TextLeadingRow(
        title: "Home Service:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
        txt: "Available",
        txtStyle: AppFonts.text9odd(color: Color.fromRGBO(0, 0, 0, 0.5)),
      );
      break;
    case 'services':
      global.col3[index] = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Services:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("- Skin Care"),
          Text("- Hair"),
          Text("- Nails"),
        ],
      );
      break;
    case 'website':
      global.col3[index] = Row(
        children: <Widget>[
          Text(
            "Website:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("www.google.com")
        ],
      );
      break;
    case 'products':
      global.col3[index] = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Products:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("- Honey"),
          Text("- Fresh Milk"),
          Text("- Honey"),
        ],
      );
      break;
    case 'classes':
      global.col3[index] = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Classes:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          Text("- Fitness"),
          Text("- Fitness"),
          Text("- Fitness"),
        ],
      );
      break;
    case 'owner':
      global.col3[index] = TextLeadingRow(
        title: "Owner:",
        titleStyle: kProfileHeaderTitle9Rgb_67,
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
              style: kProfileHeaderTitle9Rgb_67,
            ),
            Text("- The Kings"),
            Text("- Buffet"),
            Text("- On Time Delivery")
          ]);
      break;
    case 'menu':
      global.col3[index] = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Menu:",
            style: kProfileHeaderTitle9Rgb_67,
          ),
          InkWell(
            child: Image(
              image: AssetImage(PathFiles.ImgPath + "gallery.png"),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ImageWrapper(
                    imageProvider: AssetImage("assets/images/gallery.png"),
                  ),
                ),
              );
            },
          ),
        ],
      );
      break;
    case 'photos':
      global.col3[index] = SizedBox(
        height: 125.h,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "Photos",
              style: kProfileHeaderTitle9Rgb_67,
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
                              builder: (context) => ImageWrapper(
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
