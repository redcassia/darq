import 'dart:convert';
import 'dart:ui';
import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/views/screens/filter_page.dart';
import 'package:darq/views/home/widget_generator/widget_generator.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/default_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';
import 'package:provider/provider.dart';

class ListingPage extends StatefulWidget {
  final String jsonFile;
  final List<String> filterPredicate;
  final Map<String, dynamic> layout;
  ListingPage({this.jsonFile, this.layout, List<String> filterPredicate})
      : filterPredicate =
            (filterPredicate?.isNotEmpty ?? false) ? filterPredicate : null;
  @override
  _ListingPageState createState() => _ListingPageState();
}

class _ListingPageState extends State<ListingPage> {
  double rating = 0.0;
  Map<String, dynamic> _layout;
  String jsonFile;
  dynamic _data;
  String local;

  _loadData() {
    GraphQLClient client =
        Provider.of<AuthStateProvider>(context, listen: false).getClient;
    client
        .query(QueryOptions(
            documentNode: gql(_layout["query"]),
            variables: {'sub_types': widget.filterPredicate}))
        .then((result) {
      if (!result.hasException) setState(() => _data = result.data["items"]);
    });
  }

  _loadLayoutAndData() {
    if (_layout == null) {
      rootBundle
          .loadString(AssetPath.JsonFilePath + widget.jsonFile)
          .then((js) {
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
    jsonFile = widget.jsonFile;
    _loadLayoutAndData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                isTrailingReady:
                    _layout == null ? false : _layout["appbar"]["filter"],
                onFilterPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => FilterPage(
                                _layout["appbar"]["values_query"],
                                (context, predicate) =>
                                    Navigator.pushReplacement(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => ListingPage(
                                                jsonFile: jsonFile,
                                                layout: _layout,
                                                filterPredicate: predicate))),
                                selectedValues: widget.filterPredicate,
                              )));
                })),
        body: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                translate(_layout == null ? "" : _layout["appbar"]["title"]),
                style: AppFonts.title5(color: Color(AppColors.cyprus)),
              ),
              SizedBox(
                height: 5.h,
              ),
              Text(
                translate("choose_your_favourite"),
                style: AppFonts.title7(color: Color(AppColors.pickledBlueWood)),
              ),
              Flexible(
                child: ListView.builder(
                    shrinkWrap: true,
                    padding: EdgeInsets.zero,
                    itemCount: _data?.length ?? 0,
                    itemBuilder: (BuildContext context, int index) {
                      return Padding(
                          padding: EdgeInsets.only(top: 20.h),
                          child: DefaultCard(
                              margin: EdgeInsets.only(bottom: 10.h),
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
                                  ])));
                    }),
              ),
            ],
          ),
        ));
  }

  ListView buildCardColumn(List<dynamic> columnLayout, int index) {
    var cardData = _data == null ? null : _data[index];

    return ListView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        padding: EdgeInsets.zero,
        itemCount: columnLayout.length,
        itemBuilder: (BuildContext context, int widgetIndex) {
          return generateWidget(context, columnLayout[widgetIndex], cardData,
              jsonFile: widget.jsonFile);
        });
  }
}
