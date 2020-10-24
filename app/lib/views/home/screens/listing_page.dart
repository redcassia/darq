import 'dart:convert';
import 'dart:ui';

import 'package:darq/backend/session.dart';

import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/screens/filter_page.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:darq/views/home/widget_generator.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/rounded_capsule.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';

class ListingPage extends StatefulWidget {
  final String jsonFile;
  final List<String> filterPredicate;
  Map<String, dynamic> layout;
  ListingPage({this.jsonFile, this.layout, List<String> filterPredicate})
      : filterPredicate =
            (filterPredicate?.isNotEmpty ?? false) ? filterPredicate : null;
  @override
  _ListingPageState createState() => _ListingPageState();
}

class _ListingPageState extends State<ListingPage> {
  double rating = 0.0;
  Map<String, dynamic> _layout;
  dynamic _data;
  String local;

  _loadData() {
    Session.getClient().then((client) => client
            .query(QueryOptions(
                documentNode: gql(_layout["query"]),
                variables: {'sub_types': widget.filterPredicate}))
            .then((result) {
          if (!result.hasException)
            setState(() => _data = result.data["items"]);
        }));
  }

  _loadLayoutAndData() {
    if (_layout == null) {
      rootBundle.loadString(PathFiles.ProfilePath + widget.jsonFile).then((js) {
        setState(() => _layout = json.decode(js)["list"]);
        _loadData();
      });
    } else {
      _loadData();
    }
  }

  @override
  void initState() {
    super.initState();

    _layout = widget.layout;
    _loadLayoutAndData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: _layout == null
                    ? ""
                    : translate(_layout["appbar"]["title"]),
                bgImage: "app_bar_rectangle.png",
                leading: BackArrow(),
                onLeadingClicked: () => Navigator.pop(context),
                trailing: (_layout == null
                        ? false
                        : _layout["appbar"]["filter"])
                    ? GestureDetector(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => FilterPage(
                                        _layout["appbar"]["values_query"],
                                        (context, predicate) =>
                                            Navigator.pushReplacement(
                                                context,
                                                MaterialPageRoute(
                                                    builder: (context) =>
                                                        ListingPage(
                                                            jsonFile:
                                                                widget.jsonFile,
                                                            layout: _layout,
                                                            filterPredicate:
                                                                predicate))),
                                        selectedValues: widget.filterPredicate,
                                      )));
                        },
                        child: RoundedCapsule(
                            Localizations.localeOf(context).languageCode == 'en'
                                ? "left"
                                : "right",
                            horizontalPadding: 16.w,
                            verticalPadding: 5.h,
                            icon: Image(
                                fit: BoxFit.fitHeight,
                                width: 18.w,
                                image: AssetImage(
                                    PathFiles.ImgPath + "filter.png"))),
                      )
                    : null)),
        body: ListView.builder(
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            itemCount: _data?.length ?? 0,
            itemBuilder: (BuildContext context, int index) {
              return Padding(
                  padding: EdgeInsets.only(top: 20.h),
                  child: DefaultCard(
                      margin: EdgeInsets.only(
                          right: 20.w, left: 20.w, bottom: 10.h),
                      padding: EdgeInsets.zero,
                      child: Padding(
                          padding:
                              Localizations.localeOf(context).languageCode ==
                                      'en'
                                  ? EdgeInsets.only(
                                      left: 13.w,
                                      right: 28.w,
                                      top: 9.w,
                                      bottom: 8.h)
                                  : EdgeInsets.only(
                                      left: 28.w,
                                      right: 13.w,
                                      top: 9.w,
                                      bottom: 8.h),
                          child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(
                                    width: 70.w,
                                    child: buildCardColumn(
                                        _layout["columns"]["start"], index)),
                                SizedBox(width: 17.w),
                                Expanded(
                                    child: buildCardColumn(
                                        _layout["columns"]["end"], index))
                              ]))));
            }));
  }

  ListView buildCardColumn(List<dynamic> columnLayout, int index) {
    var cardData = _data == null ? null : _data[index];

    return ListView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        padding: EdgeInsets.zero,
        itemCount: columnLayout.length,
        itemBuilder: (BuildContext context, int widgetIndex) {
          var dataPath = columnLayout[widgetIndex]["data"];
          var widgetData = cardData;
          if (dataPath != null && cardData != null) {
            for (var x in dataPath) widgetData = widgetData[x];
          }

          return generateWidget(
            columnLayout[widgetIndex]["widget"],
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
        });
  }
}
