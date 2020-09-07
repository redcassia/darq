import 'dart:convert';
import 'dart:ui';

import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/widget_generator.dart';
import 'package:darq/views/shared/app_bars/profile_appbar.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';

import '../../../backend.dart';

class DetailsPage extends StatefulWidget {
  final String jsonFile;
  final String id;

  DetailsPage({this.jsonFile, this.id});
  @override
  _DetailsPageState createState() => _DetailsPageState();
}

class _DetailsPageState extends State<DetailsPage> {
  double rating = 0.0;
  Map<String, dynamic> _layout;
  dynamic _data;

  loadLayoutAndData() {
    rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile).then((js) {
      setState(() => _layout = json.decode(js));

      Backend.getClient().then((client) => client
              .query(QueryOptions(
                  documentNode: gql(_layout["detailed"]["query"]),
                  variables: {'id': widget.id}))
              .then((result) {
            if (!result.hasException)
              setState(() => _data = result.data["item"]);
          }));
    });
  }

  @override
  void initState() {
    super.initState();
    this.loadLayoutAndData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.h),
            child: ProfileAppBar(
                filterIndicator: _layout == null
                    ? false
                    : _layout["detailed"]["appbar"]["filter"],
                buttonName: _layout == null
                    ? ""
                    : _layout["detailed"]["appbar"]["text"])),
        body: DefaultCard(
            margin: EdgeInsets.only(
                bottom: 33.h, right: 19.w, left: 20.w, top: 6.h),
            padding: EdgeInsets.only(
                left: 21.w, right: 19.w, top: 12.h, bottom: 17.h),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Flexible(
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                        SizedBox(
                            width: 80.w,
                            height: 110.h,
                            child: buildCardColumn(context, _layout == null
                                ? null
                                : _layout["detailed"]["columns"]["header"]
                                    ["start"], false)),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: buildCardColumn(context, _layout == null
                                ? null
                                : _layout["detailed"]["columns"]["header"]
                                    ["end"], false))
                      ])),
                  Flexible(
                      flex: 4,
                      child: buildCardColumn(context, _layout == null
                          ? null
                          : _layout["detailed"]["columns"]["body"], true))
                ])));
  }

  ListView buildCardColumn(BuildContext context, List<dynamic> columnLayout, bool scroll) {
    bool divisionEmpty = false;
    List<Widget> children = new List();

    if (_data != null) {
      for (var widgetIndex = 0; widgetIndex < columnLayout.length; ++widgetIndex) {
        String widgetType = columnLayout[widgetIndex]["widget"];

        var dataPath = columnLayout[widgetIndex]["data"];
        var widgetData = _data;
        if (dataPath != null && _data != null) {
          for (var x in dataPath) widgetData = widgetData[x];
        }

        Widget child = generateWidget(widgetType,
          context: context,
          jsonFile: widget.jsonFile,
          data: widgetData,
          height: columnLayout[widgetIndex]["height"],
          width: columnLayout[widgetIndex]["width"],
          titleText: columnLayout[widgetIndex]["titleText"],
          titleSize: columnLayout[widgetIndex]["titleSize"],
          titleColor: columnLayout[widgetIndex]["titleColor"],
          trailingText: columnLayout[widgetIndex]["trailingText"],
          trailingTextSize: columnLayout[widgetIndex]["trailingTextSize"],
          trailingTextColor: columnLayout[widgetIndex]["trailingTextColor"],
          text: columnLayout[widgetIndex]["text"],
          textSize: columnLayout[widgetIndex]["textSize"],
          textColor: columnLayout[widgetIndex]["textColor"],
          iconName: columnLayout[widgetIndex]["iconName"],
          textIfTrue: columnLayout[widgetIndex]["textIfTrue"],
          textIfFalse: columnLayout[widgetIndex]["textIfFalse"],
          maxElements: columnLayout[widgetIndex]["maxElements"],
        );

        if (widgetType == "divider") {
          if (divisionEmpty) child = null;
          divisionEmpty = true;
        }
        else {
          if (child != null) divisionEmpty = false;
        }

        if (child == null) children.add(Container());
        else children.add(child);
      }
    }

    return ListView(
        physics: scroll ? AlwaysScrollableScrollPhysics() : NeverScrollableScrollPhysics(),
        padding: EdgeInsets.zero,
        children: children
    );
  }
}
