import 'dart:convert';
import 'dart:ui';

import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/screens/filter_page.dart';
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
  final String id;

  final String jsonFile;
  DetailsPage({this.id, this.jsonFile});
  @override
  _DetailsPageState createState() => _DetailsPageState();
}

class _DetailsPageState extends State<DetailsPage> {
  double rating = 0.0;
  Map<String, dynamic> _layout;
  dynamic _originalData;
  dynamic _data;
  List<String> _filterPredicate;
  bool profFound = false;

  void _calculateFilteredData() {
    setState(() {
      _data = new Map<String, dynamic>();
      _data.addAll(_originalData);
      if (_filterPredicate != null) {
        var path = _layout["appbar"]["filter_data_path"];
        var attr = _layout["appbar"]["filter_attribute"];
        _data[path] =
            _data[path].where((_) => _filterPredicate.contains(_[attr])).toList();
      }
    });
  }

  loadData() {
    Backend.getClient().then((client) => client
            .query(QueryOptions(
                documentNode: gql(_layout["query"]),
                variables: {'id': widget.id}))
            .then((result) {
          if (!result.hasException)
            setState(() {
              _originalData = result.data["item"];
              _data = new Map<String, dynamic>();
              _data.addAll(_originalData);
            });
        }));
  }

  _loadLayoutAndData() {
    rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile).then((js) {
      setState(() => _layout = json.decode(js)["detailed"]);
      loadData();
    });
  }

  @override
  void initState() {
    super.initState();
    this._loadLayoutAndData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFF86C2C2),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.h),
            child: ProfileAppBar(
                id: widget.id,
                filterFunction: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => FilterPage(
                              _layout["appbar"]["values_query"],
                              (context, predicate) {
                                _filterPredicate = predicate;
                                if (_filterPredicate.isEmpty)
                                  _filterPredicate = null;
                                _calculateFilteredData();
                              },
                              selectedValues: _filterPredicate,
                            ))),
                filterIndicator: _layout == null
                    ? false
                    : _layout["appbar"]["filter"],
                buttonName: _layout == null
                    ? ""
                    : _layout["appbar"]["text"])),
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
                            child: buildCardColumn(
                                context,
                                _layout == null
                                    ? null
                                    : _layout["columns"]["header"]
                                        ["start"],
                                false)),
                        SizedBox(width: 17.w),
                        Flexible(
                            flex: 2,
                            child: buildCardColumn(
                                context,
                                _layout == null
                                    ? null
                                    : _layout["columns"]["header"]
                                        ["end"],
                                false))
                      ])),
                  Flexible(
                      flex: 4,
                      child: buildCardColumn(
                          context,
                          _layout == null
                              ? null
                              : _layout["columns"]["body"],
                          true))
                ])));
  }

  ListView buildCardColumn(
      BuildContext context, List<dynamic> columnLayout, bool scroll) {
    bool divisionEmpty = false;
    List<Widget> children = new List();

    if (_data != null) {
      for (var widgetIndex = 0;
          widgetIndex < columnLayout.length;
          ++widgetIndex) {
        String widgetType = columnLayout[widgetIndex]["widget"];

        var dataPath = columnLayout[widgetIndex]["data"];
        var widgetData = _data;
        if (dataPath != null && _data != null) {
          for (var x in dataPath) widgetData = widgetData[x];
        }

        Widget child = generateWidget(
          widgetType,
          context: context,
          jsonFile: widget.jsonFile,
          data: widgetData,
          id: widget.id,
          detailedPage: true,
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
        } else {
          if (child != null) divisionEmpty = false;
        }

        if (child == null)
          children.add(Container());
        else
          children.add(child);
      }
    }

    return ListView(
        physics: scroll
            ? AlwaysScrollableScrollPhysics()
            : NeverScrollableScrollPhysics(),
        padding: EdgeInsets.zero,
        children: children);
  }
}
