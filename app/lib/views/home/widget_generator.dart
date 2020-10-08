import 'dart:math';
import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/screens/chat_room.dart';
import 'package:darq/views/home/home_screens_style_const.dart';
import 'package:darq/views/home/screens/details_page.dart';
import 'package:darq/views/home/screens/personnel_page.dart';
import 'package:darq/views/shared/custom_divider.dart';
import 'package:darq/views/shared/full_img_wrapper.dart';
import 'package:darq/views/shared/leading_row.dart';
import 'package:darq/views/home/screens/rating_screen.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

Widget generateWidget(String widgetType,
    {BuildContext context,
    dynamic data,
    bool detailedPage = false,
    String id,
    String jsonFile,
    double height,
    double width,
    String titleText,
    String titleSize,
    Map<String, dynamic> titleColor,
    String trailingText,
    String trailingTextSize,
    Map<String, dynamic> trailingTextColor,
    String text,
    String textSize,
    Map<String, dynamic> textColor,
    String iconName,
    String textIfTrue,
    String textIfFalse,
    int maxElements}) {
  switch (widgetType) {
    case 'vertical_spacer':
      return SizedBox(height: height.h);

    case 'divider':
      return Column(
        children: [
          SizedBox(height: 17.h),
          CustomDivider(),
          SizedBox(height: 17.h),
        ],
      );

    case 'text_overflowed':
      if (text != null) data = text;
      if (data == null) return null;
      return Text(data,
          style: AppFonts.makeStyle(textSize, textColor),
          overflow: TextOverflow.ellipsis);

    case 'text':
      if (text != null) data = text;
      if (data == null) return null;
      return Text(data, style: AppFonts.makeStyle(textSize, textColor));

    case 'text_with_title':
      if (data == null) return null;
      if (data is List<dynamic>) {
        data = data.join(", ");
      }

      if (trailingText == null) {
        return TextLeadingRow(
            title: translate(titleText),
            titleStyle: AppFonts.makeStyle(titleSize, titleColor),
            txt: data.toString(),
            txtStyle: AppFonts.makeStyle(textSize, textColor));
      } else {
        return TextLeadingRow(
            title: translate(titleText),
            titleStyle: AppFonts.makeStyle(titleSize, titleColor),
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(
                    style: AppFonts.makeStyle(textSize, textColor),
                    children: <TextSpan>[
                      TextSpan(text: data.toString()),
                      TextSpan(
                          text: trailingText,
                          style: AppFonts.makeStyle(
                              trailingTextSize, trailingTextColor))
                    ])));
      }
      break;

    case 'bool_text_with_title':
      if (data == null) return null;
      return TextLeadingRow(
          title: translate(titleText),
          titleStyle: AppFonts.makeStyle(titleSize, titleColor),
          txt: data ? translate(textIfTrue) : translate(textIfFalse),
          txtStyle: AppFonts.makeStyle(textSize, textColor));

    case 'text_with_icon':
      if (data == null) return null;
      return IconLeadingRow(
          iconName: iconName,
          txt: data,
          textStyle: AppFonts.makeStyle(textSize, textColor));

    case 'itemized_text_with_title':
      if (data == null) return null;
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(translate(titleText), style: AppFonts.makeStyle(titleSize, titleColor)),
          SizedBox(height: 5.h),
          ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              padding: EdgeInsets.zero,
              itemCount: data.length,
              itemBuilder: (BuildContext context, int index) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text("- ${data[index]}",
                        style: AppFonts.makeStyle(textSize, textColor)),
                    SizedBox(height: 3.h),
                  ],
                );
              }),
        ],
      );

    case 'wrapped_text':
      if (data == null) return null;
      return Wrap(
          spacing: 6.w,
          children: List.generate(min(data.length, maxElements),
              (index) => CustomChip(text: data[index])));

    case 'wrapped_text_with_title':
      if (data == null) return null;
      return Wrap(
        spacing: 6.w,
        children: <Widget>[
          Text(translate(titleText), style: AppFonts.makeStyle(titleSize, titleColor)),
          SizedBox(height: 17.h),
          for (int i = 0; i < min(data.length, maxElements); i++)
            CustomChip(text: data[i]),
        ],
      );

    case 'wrapped_text_with_icon':
      if (data == null) return null;
      return Wrap(
          spacing: 6.w,
          children: List.generate(
              min(data.length, maxElements),
              (index) => IconLeadingRow(
                  iconName: iconName,
                  txt: data[index],
                  textStyle: AppFonts.makeStyle(textSize, textColor))));

    case 'picture':
      return Picture(height: height.h, width: width.w, img: data);

    case 'picture_gallery':
      if (data?.length == 0 || data == null) return null;
      return SizedBox(
          height: 125.h,
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(translate(titleText),
                    style: AppFonts.makeStyle(titleSize, titleColor)),
                SizedBox(height: 17.h),
                Flexible(
                    child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        padding: EdgeInsets.zero,
                        itemCount: data?.length ?? 0,
                        itemBuilder: (BuildContext context, int index) {
                          return Padding(
                              padding: EdgeInsets.only(right: 6.w),
                              child: InkWell(
                                  child: CachedNetworkImage(
                                      imageUrl:
                                          "http://redcassia.com:3001/attachment/${data[index]}",
                                      placeholder: (context, url) =>
                                          CircularProgressIndicator(),
                                      errorWidget: (context, url, error) =>
                                          Icon(Icons.error),
                                      filterQuality: FilterQuality.high,
                                      width: 141.w,
                                      height: 101.h,
                                      fit: BoxFit.contain),
                                  onTap: () => Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => FullImageWrapper(
                                              imageProvider:
                                                  "http://redcassia.com:3001/attachment/${data[index]}")))));
                        }))
              ]));

    case 'operating_hours':
      if (data == null) return null;
      return IconLeadingRow(
          iconName: "clock.png",
          txt:
              data["all_day"] ? "24 hrs" : "${data["open"]} - ${data["close"]}",
          textStyle: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));

    case 'operating_hours_no_icon':
      if (data == null) return null;
      return Text(
          data["all_day"] ? "24 hrs" : "${data["open"]} - ${data["close"]}",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case 'duration':
      if (data == null) return null;
      return Wrap(children: <Widget>[
        TextLeadingRow(
            title: "Start:",
            titleStyle: kTitle9Rgb_67,
            txt: data["start"],
            txtStyle: kText9OddRgb_05),
        SizedBox(width: 53.h, height: 5.h),
        TextLeadingRow(
            title: "End:",
            titleStyle: kTitle9Rgb_67,
            txt: data["end"],
            txtStyle: kText9OddRgb_05)
      ]);

    case 'price':
      if (data == null) return null;
      if (data["value"] != null) {
        return TextLeadingRow(
            title: translate(titleText),
            titleStyle: AppFonts.makeStyle(titleSize, titleColor),
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(
                    style: AppFonts.makeStyle(textSize, textColor),
                    children: <TextSpan>[
                      TextSpan(text: "${data["value"]} ${data["currency"]}"),
                      TextSpan(
                          text: trailingText,
                          style: AppFonts.makeStyle(
                              trailingTextSize, trailingTextColor))
                    ])));
      } else {
        return TextLeadingRow(
            title: translate(titleText),
            titleStyle: AppFonts.makeStyle(titleSize, titleColor),
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(
                    style: AppFonts.makeStyle(textSize, textColor),
                    children: <TextSpan>[
                      TextSpan(
                          text:
                              "${data["valueLower"]} : ${data["valueUpper"]} ${data["currency"]}"),
                      TextSpan(
                          text: trailingText,
                          style: AppFonts.makeStyle(
                              trailingTextSize, trailingTextColor))
                    ])));
      }
      break;

    case 'rating':
      if (data == null)
        return InkWell(
            onTap: () {
              if (detailedPage)
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            RatingScreen(businessId: id, rating: data)));
            },
            child: Text(translate("not_rated"),
                textAlign: TextAlign.center,
                style: AppFonts.text8(color: Color.fromRGBO(0, 0, 0, 0.7))));
      return SmoothStarRating(
          onBoxClicked:()=> detailedPage
              ?      Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      RatingScreen(businessId: id, rating: data)))
              : {},
          mainAxisAlignment: MainAxisAlignment.start,
          allowHalfRating: true,
          size: 14.w,
          filledIconData: Icons.star,
          halfFilledIconData: Icons.star_half,
          defaultIconData: Icons.star_border,
          starCount: 5,
          rating: data.toDouble(),
          borderColor: Color(0xFFE1A854),
          color: Color(0xFFE1A854),
          spacing: 0.0);

    case 'experience':
      if (data == null) return null;
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
                itemCount: data.length,
                itemBuilder: (BuildContext context, int i) {
                  return Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                            "${data[i]["country"]}${data[i]["institution"] != null ? " - ${data[i]["institution"]}" : ""}",
                            style: AppFonts.title11Odd(
                                color: Color.fromRGBO(0, 0, 0, 0.69))),
                        Text(
                            "${data[i]["from"]} - ${data[i]["in_position"] ? "Present" : "${data[i]["to"]}"}",
                            style: AppFonts.text9odd(
                                color: Color.fromRGBO(0, 0, 0, 0.5))),
                        SizedBox(height: 4.h)
                      ]);
                })
          ])));

    case "view_details_button":
      if (data == null) return null;
      return GestureDetector(
        onTap: () =>
            Navigator.push(context, MaterialPageRoute(builder: (context) {
          return DetailsPage(jsonFile: jsonFile, id: data);
        })),
        child: Text(translate("view_details"),
            style: AppFonts.title11Odd(color: Color(0xFFE1A854))),
      );

    case "contact_button":
      if (data == null) return null;
      return Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
        CustomButton(
            height: 23.h,
            width: 93.w,
            buttonName: translate(titleText),
            color: Color(0xFF426676),
            borderRadius: 27,
            textStyle: AppFonts.title11Odd(color: Colors.white),
            onButtonPressed: () => {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ChatRoom(businessId: data)))
                })
      ]);

    case 'personnel':
      if (data == null) return null;
      return Padding(
          padding: EdgeInsets.only(left: 24.w, right: 28.w),
          child: GridView.count(
              physics: NeverScrollableScrollPhysics(),
              crossAxisSpacing: 30.w,
              mainAxisSpacing: 17.h,
              shrinkWrap: true,
              crossAxisCount: 2,
              children: List.generate(data.length, (i) {
                return GestureDetector(
                    onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                PersonnelPage(data: data[i]))),
                    child: DefaultCard(
                        margin: EdgeInsets.zero,
                        padding:
                            EdgeInsets.only(top: 6.h, left: 10.w, right: 9.w),
                        color: Color(0xFFF5F9FA),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: <Widget>[
                              Picture(
                                  height: 43.h,
                                  width: 44.w,
                                  img: data[i]["picture"]),
                              SizedBox(height: 2.h),
                              Text("${data[i]["name"]}",
                                  style: AppFonts.title11Odd(
                                      color: Color(0xFF545454)),
                                  textAlign: TextAlign.center),
                              Text("${data[i]["nationality"]}",
                                  style: AppFonts.text9odd(
                                      color: Color.fromRGBO(0, 0, 0, 0.5))),
                              Text("${data[i]["profession"]}",
                                  style: AppFonts.text10w500(
                                      color: Color.fromRGBO(0, 0, 0, 0.37)))
                            ])));
              })));

    default:
      throw Exception("Unknown widget '$widgetType'");
  }
}
