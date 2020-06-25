import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/custom_tile/horizontal_tile/horizontal_split_tile.dart';
import 'package:darq/views/shared/custom_tile/horizontal_tile/tile_content_expanded.dart';
import 'package:darq/views/shared/custom_tile/horizontal_tile/tile_content_leading.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/capsule/left_rounded_capsule.dart';
import 'package:darq/views/home/widgets/description_widget.dart';
import 'package:darq/views/home/widgets/profile_template.dart';

class GeneralProfileTemplate extends StatefulWidget {
  ///profile title [title] of String type
  @required
  final String title;

  /// [subtitle] of type boolean to indicate whether the tile has subtitle or not .. it is true by default
  bool subtitle;

  ///[filter] of type boolean to indicate whether there is a filter icon or not ... it is false by default
  bool filter;

  ///[descriptionWidget] of type boolean to indicate whether the description is a widget or just a text of type String ... it is false by default
  bool descriptionWidget;

  GeneralProfileTemplate(
      {this.title,
      this.filter = false,
      this.descriptionWidget = false,
      this.subtitle = true});
  @override
  _GeneralProfileTemplateState createState() => _GeneralProfileTemplateState();
}

class _GeneralProfileTemplateState extends State<GeneralProfileTemplate> {
  var rating = 0.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFF5F9FA),
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(124.h),
            child: GeneralProfileAppBar(widget: widget)),
        body: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            child: ListView.builder(
                itemCount: 15,
                padding: EdgeInsets.only(top: 147.h),
                itemBuilder: (context, index) {
                  return HorizontalSplitTile(
                      leftWidget: TileContentLeading(
                          imgHeight: 70.w,
                          imgWidth: 70.w,
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
                                      ? TitledDescription(
                                          address: "Al Nasser, St. 827",
                                          founded: "2012",
                                          curriculum: "Canadian, British")
                                      : UntitledDescription(
                                          address: "Al Nasser, St. 827",
                                          time: "2:00 PM to 5:00PM",
                                          subtitle: "Conference")
                                  : null,
                              buttonName: widget.title == "Self Employed"
                                  ? "Contact Me"
                                  : "Contact Us",
                              onButtonClicked: (_) => _
                                  ? {
                                      if (widget.title == "Beauty & Spa")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "beauty_spa.json");
                                        }))
                                      else if (widget.title == "Sports")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "club.json");
                                        }))
                                      else if (widget.title == "Limousine")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "limousine.json");
                                        }))
                                      else if (widget.title == "Hospitality")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "hospitality.json");
                                        }))
                                      else if (widget.title ==
                                          "Cleaning & Maintenance")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile:
                                                  "cleaning_maintenance.json");
                                        }))
                                      else if (widget.title == "Self Employed")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "self_employed.json");
                                        }))
                                      else if (widget.title == "Domestic Help")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "domestic_help.json");
                                        }))
                                      else if (widget.title == "Stationeries")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "stationeries.json");
                                        }))
                                      else if (widget.title == "Events")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "events.json");
                                        }))
                                      else if (widget.title == "Cuisines")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "cuisine.json");
                                        }))
                                      else if (widget.title == "Entertainment")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "entertainment.json");
                                        }))
                                      else if (widget.title ==
                                          "Children Education Centers")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile:
                                                  "children_education_center.json");
                                        }))
                                      else if (widget.title == "Made In Qatar")
                                        Navigator.push(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return ProfileTemplate(
                                              jsonFile: "made_in_qatar.json");
                                        }))
                                    }
                                  : {})));
                })));
  }
}

class GeneralProfileAppBar extends StatelessWidget {
  const GeneralProfileAppBar({
    Key key,
    @required this.widget,
  }) : super(key: key);

  final GeneralProfileTemplate widget;

  @override
  Widget build(BuildContext context) {
    return DefaultAppBar(
        allowHorizontalPadding: false,
        title: widget.title,
        bgImage: "app_bar_rectangle.png",
        leading: RightRoundedCapsule(
            iconColor: Color.fromRGBO(134, 194, 194, 0.69),
            verticalPadding: 5.h,
            horizontalPadding: 19.w,
            icon: Image(
                width: 9.73.w,
                fit: BoxFit.fill,
                image: AssetImage(PathFiles.ImgPath + "back.png"))),
        trailing: widget.filter
            ? LeftRoundedCapsule(
                horizontalPadding: 16.w,
                verticalPadding: 5.h,
                icon: Image(
                    fit: BoxFit.fitHeight,
                    width: 18.w,
                    image: AssetImage(PathFiles.ImgPath + "filter.png")))
            : null,
        onLeadingClicked: () => Navigator.pop(context));
  }
}
