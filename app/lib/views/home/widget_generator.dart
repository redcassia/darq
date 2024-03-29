import 'dart:math';
import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/home_screens_style_const.dart';
import 'package:darq/views/home/screens/chat_room.dart';
import 'package:darq/views/home/screens/details_page.dart';
import 'package:darq/views/home/screens/personnel_page.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/custom_chip.dart';
import 'package:darq/views/shared/custom_divider.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/full_img_wrapper.dart';
import 'package:darq/views/shared/image_container.dart';
import 'package:darq/views/shared/leading_row.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:link/link.dart';
import 'package:url_launcher/url_launcher.dart';

Widget generateWidget(BuildContext context, dynamic layout, dynamic allData,
    {String id, String jsonFile}) {
  String widgetType = layout["widget"];

  dynamic data;
  if (allData != null) {
    dynamic dataPath = layout["data"];
    if (dataPath != null) {
      data = allData;
      for (var x in dataPath) data = data[x];
    } else {
      dynamic joined = layout["joinedData"];
      if (joined != null) {
        data = joined["children"].map((dataPath) {
          var data = allData;
          for (var x in dataPath) {
            try {
              data = translate(data[x]);
            } catch (e) {
              data = data[x];
            }
          }
          return data;
        }).join(joined["separator"]);
      }
    }
  }

  switch (widgetType) {
    case 'vertical_spacer':
      return SizedBox(height: (layout["height"] as double).h);

    case 'divider':
      return Column(
        children: [
          SizedBox(height: 17.h),
          CustomDivider(),
          SizedBox(height: 17.h),
        ],
      );

    case 'text_overflowed':
      if (layout["text"] != null) data = layout["text"];
      if (data == null) return null;
      return Text(data,
          style: AppFonts.makeStyle(layout["textSize"], layout["textColor"]),
          maxLines: 3,
          overflow: TextOverflow.ellipsis);

    case 'text':
      if (layout["text"] != null) data = layout["text"];
      if (data == null) return null;
      try {
        data = translate(data);
      } catch (e) {}
      return Text(data,
          style: AppFonts.makeStyle(layout["textSize"], layout["textColor"]));

    case "website_with_title":
      if (data == null) return null;
      return TextLeadingRow(
          title: translate(layout["titleText"]),
          titleStyle:
              AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
          widget: Link(
              url: data.toString(),
              child: Text(data.toString().split('/').last,
                  style: AppFonts.makeStyle(
                      layout["textSize"], layout["textColor"]))));
      break;

    case 'text_with_title':
      if (data == null) return null;
      if (data is List<dynamic>) data = data.join(", ");
      try {
        data = translate(data);
      } catch (e) {}

      if (double.tryParse(data) != null) {
        data = Session.formatInt(int.parse(data));
      }

      if (layout["trailingText"] == null) {
        return TextLeadingRow(
            title: translate(layout["titleText"]),
            titleStyle:
                AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
            txt: data.toString(),
            txtStyle:
                AppFonts.makeStyle(layout["textSize"], layout["textColor"]));
      } else {
        return TextLeadingRow(
            title: translate(layout["titleText"]),
            titleStyle:
                AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(
                    style: AppFonts.makeStyle(
                        layout["textSize"], layout["textColor"]),
                    children: <TextSpan>[
                      TextSpan(text: data.toString()),
                      TextSpan(
                          text: layout["trailingText"],
                          style: AppFonts.makeStyle(layout["trailingTextSize"],
                              layout["trailingTextColor"]))
                    ])));
      }
      break;

    case 'bool_text_with_title':
      if (data == null) return null;
      return TextLeadingRow(
          title: translate(layout["titleText"]),
          titleStyle:
              AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
          txt: data
              ? translate(layout["textIfTrue"])
              : translate(layout["textIfFalse"]),
          txtStyle:
              AppFonts.makeStyle(layout["textSize"], layout["textColor"]));

    case 'text_with_icon':
      if (data == null) return null;
      try {
        data = translate(data);
      } catch (e) {}
      if (double.tryParse(data) != null) {
        data = Session.formatInt(int.parse(data));
      }
      return IconLeadingRow(
          iconName: layout["iconName"],
          txt: data,
          textStyle:
              AppFonts.makeStyle(layout["textSize"], layout["textColor"]));

    case 'itemized_text_with_title':
      if (data == null || data.length == 0) return null;
      return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(translate(layout["titleText"]),
                style: AppFonts.makeStyle(
                    layout["titleSize"], layout["titleColor"])),
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
                            style: AppFonts.makeStyle(
                                layout["textSize"], layout["textColor"])),
                        SizedBox(height: 3.h)
                      ]);
                })
          ]);

    case 'wrapped_text':
      if (data == null || data.length == 0) return null;
      return Wrap(
          spacing: 6.w,
          children: List.generate(min(data.length, layout["maxElements"]),
              (index) => CustomChip(text: data[index])));

    case 'wrapped_text_with_title':
      if (data == null || data.length == 0) return null;
      return Wrap(
        spacing: 6.w,
        children: <Widget>[
          Text(translate(layout["titleText"]),
              style: AppFonts.makeStyle(
                  layout["titleSize"], layout["titleColor"])),
          SizedBox(height: 17.h),
          for (int i = 0; i < min(data.length, layout["maxElements"]); i++)
            CustomChip(text: data[i]),
        ],
      );

    case 'wrapped_text_with_icon':
      if (data == null) return null;

      return Wrap(
          spacing: 6.w,
          children:
              List.generate(min(data.length, layout["maxElements"]), (index) {
            if (double.tryParse(data[index]) != null) {
              data[index] = Session.formatInt(int.parse(data[index]));
            }
            return IconLeadingRow(
                iconName: layout["iconName"],
                txt: data[index],
                textStyle: AppFonts.makeStyle(
                    layout["textSize"], layout["textColor"]));
          }));

    case 'phone_number':
      if (data == null) return null;

      return Wrap(
          spacing: 6.w,
          children:
              List.generate(min(data.length, layout["maxElements"]), (index) {
            data[index] = data[index].replaceAll(new RegExp(r"\s+"), "");
            if (double.tryParse(data[index]) != null) {
              data[index] = Session.formatInt(int.parse(data[index]));
            }

            return InkWell(
              onTap: () async {
                if (await canLaunch("tel:${data[index]}")) {
                  await launch("tel:${data[index]}");
                } else {
                  throw 'Could not launch ${data[index]}';
                }
              },
              child: IconLeadingRow(
                  iconName: layout["iconName"],
                  txt: data[index],
                  textStyle: AppFonts.makeStyle(
                      layout["textSize"], layout["textColor"])),
            );
          }));

    case 'picture':
      return Picture(
          height: (layout["height"] as double).h,
          width: (layout["width"] as double).w,
          img: data);

    case 'picture_gallery':
      if (data == null || data.length == 0) return null;
      return SizedBox(
          height: 125.h,
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(translate(layout["titleText"]),
                    style: AppFonts.makeStyle(
                        layout["titleSize"], layout["titleColor"])),
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
          txt: data["all_day"]
              ? "${translate("24_hrs")}"
              : "${Session.formatTime("0000-00-00 ${data["open"]}")} - ${Session.formatTime("0000-00-00 ${data["close"]}")}",
          textStyle: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));

    case 'operating_hours_no_icon':
      if (data == null) return null;
      return Text(
          data["all_day"]
              ? translate("24_hrs")
              : "${Session.formatTime("0000-00-00 ${data["open"]}")} - ${Session.formatTime("0000-00-00 ${data["close"]}")}",
          style: AppFonts.title11Odd(color: Color.fromRGBO(0, 0, 0, 0.7)));

    case 'duration':
      if (data == null) return null;
      return Wrap(children: <Widget>[
        TextLeadingRow(
            title: translate("start"),
            titleStyle: kTitle9Rgb_67,
            txt: Session.formatDateTime(data["start"]),
            txtStyle: kText9OddRgb_05),
        SizedBox(width: 53.h, height: 5.h),
        TextLeadingRow(
            title: translate("end"),
            titleStyle: kTitle9Rgb_67,
            txt: Session.formatDateTime(data["end"]),
            txtStyle: kText9OddRgb_05)
      ]);

    case 'price':
      if (data == null) return null;
      if (data["value"] != null) {
        return TextLeadingRow(
            title: translate(layout["titleText"]),
            titleStyle:
                AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
            widget: RichText(
                textAlign: TextAlign.start,
                text: Localizations.localeOf(context).languageCode == 'en'
                    ? TextSpan(
                        style: AppFonts.makeStyle(
                            layout["textSize"], layout["textColor"]),
                        children: <TextSpan>[
                            TextSpan(
                                text:
                                    "${Session.formatInt(data["value"])} ${translate(data["currency"])} "),
                            TextSpan(
                                text: translate(layout["trailingText"]),
                                style: AppFonts.makeStyle(
                                    layout["trailingTextSize"],
                                    layout["trailingTextColor"]))
                          ])
                    : TextSpan(
                        style: AppFonts.makeStyle(
                            layout["textSize"], layout["textColor"]),
                        children: <TextSpan>[
                            TextSpan(
                                text:
                                    "${Session.formatInt(data["value"])} ${translate(data["currency"])} "),
                            TextSpan(
                                text: translate(layout["trailingText"]),
                                style: AppFonts.makeStyle(
                                    layout["trailingTextSize"],
                                    layout["trailingTextColor"]))
                          ])));
      } else {
        return TextLeadingRow(
            title: translate(layout["titleText"]),
            titleStyle:
                AppFonts.makeStyle(layout["titleSize"], layout["titleColor"]),
            widget: RichText(
                textAlign: TextAlign.start,
                text: TextSpan(
                    style: AppFonts.makeStyle(
                        layout["textSize"], layout["textColor"]),
                    children: <TextSpan>[
                      TextSpan(
                          text:
                              "${Session.formatInt(data["valueLower"])} ${translate("to")} ${Session.formatInt(data["valueUpper"])} ${translate(data["currency"])}"),
                      TextSpan(
                          text: translate(layout["trailingText"]),
                          style: AppFonts.makeStyle(layout["trailingTextSize"],
                              layout["trailingTextColor"]))
                    ])));
      }
      break;

    case 'rating':
      if (data == null)
        return Text(translate("not_rated"),
            textAlign: TextAlign.center,
            style: AppFonts.text8(color: Color.fromRGBO(0, 0, 0, 0.7)));
      return SmoothStarRating(
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
      if (data == null || data.length == 0) return null;
      return TextLeadingRow(
          title: translate("experience"),
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
                            "${translate(data[i]["country"])}${data[i]["institution"] != null ? " - ${data[i]["institution"]}" : ""}",
                            style: AppFonts.title11Odd(
                                color: Color.fromRGBO(0, 0, 0, 0.69))),
                        Text(
                            "${Session.formatDate(data[i]["from"])} - ${data[i]["in_position"] ? translate("present") : "${Session.formatDate(data[i]["to"])}"}",
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
            buttonName: translate(layout["titleText"]),
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
                                PersonnelPage(data: data[i], id: id))),
                    child: DefaultCard(
                        margin: EdgeInsets.zero,
                        padding: EdgeInsets.only(
                            top: 6.h, left: 10.w, right: 9.w, bottom: 3.h),
                        color: Color(0xFFF5F9FA),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: <Widget>[
                              Expanded(
                                child: Picture(
                                    height: 43.h,
                                    width: 44.w,
                                    img: data[i]["picture"]),
                              ),
                              SizedBox(height: 2.h),
                              Text("${data[i]["name"]}",
                                  style: AppFonts.title11Odd(
                                      color: Color(0xFF545454)),
                                  textAlign: TextAlign.center),
                              Text(translate(data[i]["nationality"]),
                                  style: AppFonts.text9odd(
                                      color: Color.fromRGBO(0, 0, 0, 0.5))),
                              Text(translate(data[i]["profession"]),
                                  style: AppFonts.text10w500(
                                      color: Color.fromRGBO(0, 0, 0, 0.37)))
                            ])));
              })));

    default:
      throw Exception("Unknown widget '$widgetType'");
  }
}
