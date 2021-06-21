// import 'dart:convert';
// import 'dart:ui';
//
// import 'package:darq/utils/managers/auth_state_provider.dart';
// import 'package:darq/constants/asset_path.dart';
// import 'package:darq/views/home/widget_generator/widget_generator.dart';
// import 'package:darq/views/screens/filter_page.dart';
// import 'package:darq/views/widgets/app_bars/profile_appbar.dart';
//
// import 'package:darq/views/widgets/default_card.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/rendering.dart';
// import 'package:flutter/services.dart' show rootBundle;
// import 'package:flutter_screenutil/flutter_screenutil.dart';
// import 'package:flutter_translate/flutter_translate.dart';
// import 'package:graphql/client.dart';
// import 'package:provider/provider.dart';
//
// class DetailsPage extends StatefulWidget {
//   final String id;
//
//   final String jsonFile;
//   DetailsPage({this.id, this.jsonFile});
//   @override
//   _DetailsPageState createState() => _DetailsPageState();
// }
//
// class _DetailsPageState extends State<DetailsPage> {
//   double rating = 0.0;
//   Map<String, dynamic> _layout;
//   dynamic _originalData;
//   dynamic _data;
//   List<String> _filterPredicate;
//   bool profFound = false;
//
//   void _calculateFilteredData() {
//     setState(() {
//       _data = new Map<String, dynamic>();
//       _data.addAll(_originalData);
//       if (_filterPredicate != null) {
//         var path = _layout["appbar"]["filter_data_path"];
//         var attr = _layout["appbar"]["filter_attribute"];
//         _data[path] =
//             _data[path].where((_) => _filterPredicate.contains(_[attr])).toList();
//       }
//     });
//   }
//
//   loadData(BuildContext context) {
//     final user =
//     Provider.of<AuthStateProvider>(context, listen: false);
//     user.getClient.query(QueryOptions(
//                 documentNode: gql(_layout["query"]),
//                 variables: {'id': widget.id}))
//             .then((result) {
//           if (!result.hasException)
//             setState(() {
//               _originalData = result.data["item"];
//               _data = new Map<String, dynamic>();
//               _data.addAll(_originalData);
//             });
//         });
//   }
//
//   _loadLayoutAndData(BuildContext context) {
//     rootBundle.loadString(AssetPath.JsonFilePath + widget.jsonFile).then((js) {
//       setState(() => _layout = json.decode(js)["detailed"]);
//       loadData(context);
//     });
//   }
//
//   @override
//   void initState() {
//     super.initState();
//     this._loadLayoutAndData(context);
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         backgroundColor: Color(0xFF86C2C2),
//         appBar: PreferredSize(
//             preferredSize: Size.fromHeight(100.h),
//             child: ProfileAppBar(
//                 backArrowBgColor: Color(0xFF426676),
//                 id: widget.id,
//                 filterFunction: () => Navigator.push(
//                     context,
//                     MaterialPageRoute(
//                         builder: (context) => FilterPage(
//                               _layout["appbar"]["values_query"],
//                               (context, predicate) {
//                                 _filterPredicate = predicate;
//                                 if (_filterPredicate.isEmpty)
//                                   _filterPredicate = null;
//                                 _calculateFilteredData();
//                               },
//                               selectedValues: _filterPredicate,
//                             ))),
//                 filterIndicator: _layout == null
//                     ? false
//                     : _layout["appbar"]["filter"],
//                 buttonName: _layout == null
//                     ? ""
//                     : translate(_layout["appbar"]["text"]))),
//         body: DefaultCard(
//             margin: EdgeInsets.only(
//                 bottom: 33.h, right: 20.w, left: 20.w, top: 6.h),
//             child: ListView(
//                 physics: AlwaysScrollableScrollPhysics(),
//                 padding: EdgeInsets.zero,
//                 children: <Widget>[
//                   Row(
//                       mainAxisAlignment: MainAxisAlignment.start,
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: <Widget>[
//                         SizedBox(
//                             width: 80.w,
//                             height: 110.h,
//                             child: buildCardColumn(
//                                 context,
//                                 _layout == null
//                                     ? null
//                                     : _layout["columns"]["header"]["start"],
//                                 false)),
//                         SizedBox(width: 17.w),
//                         buildCardColumn(
//                             context,
//                             _layout == null
//                                 ? null
//                                 : _layout["columns"]["header"]["end"],
//                             false)
//                       ]),
//                   buildCardColumn(context,
//                       _layout == null ? null : _layout["columns"]["body"], true)
//                 ])));
//   }
//
//   Widget buildCardColumn(
//       BuildContext context, List<dynamic> columnLayout, bool scroll) {
//     bool divisionEmpty = false;
//     List<Widget> children = new List();
//
//     if (_data != null) {
//       for (var widgetIndex = 0;
//           widgetIndex < columnLayout.length;
//           ++widgetIndex) {
//         Widget child = generateWidget(context, columnLayout[widgetIndex], _data,
//             id: widget.id, jsonFile: widget.jsonFile);
//
//         if (columnLayout[widgetIndex]["widget"] == "divider") {
//           if (divisionEmpty) child = null;
//           divisionEmpty = true;
//         } else {
//           if (child != null) divisionEmpty = false;
//         }
//
//         if (child == null)
//           children.add(Container());
//         else
//           children.add(child);
//       }
//     }
//
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: children,
//     );
//   }
// }
