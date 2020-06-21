import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/custom_tile/custom_tile.dart';
import 'package:darq/views/shared/custom_tile/tile_content_expanded.dart';
import 'package:darq/views/shared/custom_tile/tile_content_leading.dart';
import 'package:darq/views/home/widgets/default_app_bar.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/home/widgets/custom_row.dart';

class ProfileDisplayTemplate extends StatefulWidget {
  ///profile title [title] of String type
  @required
  final String title;

  ///[filter] of type boolean to indicate whether there is a filter icon or not ... it is false by default
  bool filter;

  ///[descriptionWidget] of type boolean to indicate whether the description is a widget or just a text of type String ... it is false by default
  bool descriptionWidget;

  /// [subtitle] of type boolean to indicate whether the tile has subtitle or not .. it is true by default
  bool subtitle;

  ProfileDisplayTemplate(
      {this.title,
      this.filter = false,
      this.descriptionWidget = false,
      this.subtitle = true});
  @override
  _ProfileDisplayTemplateState createState() => _ProfileDisplayTemplateState();
}

class _ProfileDisplayTemplateState extends State<ProfileDisplayTemplate> {
  var rating = 0.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFF5F9FA),
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(124.h),
            child: CommunityChildrenAppBar(
                title: widget.title, trailing: widget.filter)),
        body: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            child: ListView.builder(
                itemCount: 15,
                padding: EdgeInsets.only(top: 147.h),
                itemBuilder: (context, index) {
                  return CustomTile(
                      leftWidget: TileContentLeading(
                          profilePic: "avatar.png",
                          rating: rating,
                          onRatingChange: (v) => setState(() {
                                rating = v;
                              })),
                      rightWidget: Expanded(
                          child: TileContentExpanded(
                              title: "Job title",
                              subTitle: widget.subtitle ? "Job Subtitle" : null,
                              description: widget.descriptionWidget
                                  ? null
                                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                              descriptionWidget: widget.descriptionWidget
                                  ? widget.title == "Children Education Centers"
                                      ? Column(children: <Widget>[
                                          CustomRow(
                                              title: "Address: ",
                                              txt: "Al Nasser, St. 827"),
                                          CustomRow(
                                              title: "Founded: ", txt: "2012"),
                                          CustomRow(
                                              title: "Curriculum: ",
                                              txt: "Canadian, British")
                                        ])
                                      : Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: <Widget>[
                                              Text("Al Nasser, St. 827",
                                                  style: AppFonts.title10Odd(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.7))),
                                              Text("2:00 Pm to 5:00 PM",
                                                  style: AppFonts.title10Odd(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.7))),
                                              Text("Conference",
                                                  style: AppFonts.title10Odd(
                                                      color: Color.fromRGBO(
                                                          0, 0, 0, 0.7)))
                                            ])
                                  : null,
                              buttonName: "Contact Me",
                              onButtonClicked: (_) => _
                                  ? print("clicked")
                                  : print("not clicked"))));
                })));
  }
}
