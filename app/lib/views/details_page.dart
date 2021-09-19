import 'dart:convert';
import 'dart:ui';

import 'package:darq/backend/session.dart';
import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/views/home/widget_generator/widget_generator.dart';
import 'package:darq/views/screens/filter_page.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';

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
        _data[path] = _data[path]
            .where((_) => _filterPredicate.contains(_[attr]))
            .toList();
      }
    });
  }

  loadData() {
    Session.getClient().then((client) => client
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


  _loadLayoutAndData(BuildContext context) {
    rootBundle.loadString(AssetPath.JsonFilePath + widget.jsonFile).then((js) {
      setState(() => _layout = json.decode(js)["detailed"]);
      loadData();
    });
  }

  @override
  void initState() {
    super.initState();
    this._loadLayoutAndData(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                title: _layout == null
                    ? ""
                    : translate(_layout["appbar"]["title"]),
                isTrailingReady:
                    _layout == null ? false : _layout["appbar"]["filter"],
                onFilterPressed: () {
                  Navigator.push(
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
                              )));
                })),
        body: Padding(
          padding: EdgeInsets.only(left: 30.w, right: 30.w, top: 20.h),
          child: ListView(
              physics: AlwaysScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              children: <Widget>[
                Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      buildCardColumn(
                        crossAxisAlignment: CrossAxisAlignment.center,
                          context: context,
                          columnLayout: _layout == null
                              ? null
                              : _layout["columns"]["header"]["start"],
                          scroll: false),
                      SizedBox(width: 17.w),
                      buildCardColumn(
                          context: context,
                          columnLayout: _layout == null
                              ? null
                              : _layout["columns"]["header"]["end"],
                          scroll: false)
                    ]),
                buildCardColumn(
                    context: context,
                    columnLayout:
                        _layout == null ? null : _layout["columns"]["body"],
                    scroll: true)
              ]),
        ));
  }

  Widget buildCardColumn(
      {BuildContext context, List<dynamic> columnLayout, bool scroll, CrossAxisAlignment crossAxisAlignment}) {
    bool divisionEmpty = false;
    List<Widget> children = new List();
    if (_data != null) {
      for (var widgetIndex = 0;
          widgetIndex < columnLayout.length;
          ++widgetIndex) {
        Widget child = generateWidget(context, columnLayout[widgetIndex], _data,
            id: widget.id, jsonFile: widget.jsonFile);

        if (columnLayout[widgetIndex]["widget"] == "divider") {
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

    return Column(
      crossAxisAlignment: crossAxisAlignment?? CrossAxisAlignment.start,
      children: children,
    );
  }
}
