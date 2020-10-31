import 'dart:ui';

import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';

class ListItem {
  bool isSelected = false;
  String data;
  ListItem(this.data, {this.isSelected});
}

typedef void OnSubmitFilterCallback(
    BuildContext context, List<String> selectedValues);

class FilterPage extends StatefulWidget {
  final OnSubmitFilterCallback callback;
  final String valuesQuery;
  final List<String> selectedValues;
  FilterPage(this.valuesQuery, this.callback, {this.selectedValues});
  @override
  _FilterPageState createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  List<ListItem> _values = [];

  _queryValues() {
    Session.getClient().then((client) => client
            .query(QueryOptions(documentNode: gql(widget.valuesQuery)))
            .then((result) {
          if (!result.hasException)
            setState(() {
              _values = result.data["__type"]["enumValues"]
                  .map<ListItem>((_) => ListItem(_["name"],
                      isSelected:
                          widget.selectedValues?.contains(_["name"]) ?? false))
                  .toList();
            });
        }));
  }

  @override
  void initState() {
    super.initState();
    _queryValues();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.SmallAppBarHeight.w),
            child: Padding(
                padding: EdgeInsets.only(
                    bottom: 28.h, top: 40.h, left: 19.w, right: 19.w),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                          onTap: () => setState(() {
                                for (int i = 0; i < _values.length; i++)
                                  _values[i].isSelected = false;
                              }),
                          child: Text(translate("reset"),
                              style: AppFonts.title8(
                                  color: Color.fromRGBO(0, 0, 0, 0.25)))),
                      Text(translate("filter_your_search"),
                          style: AppFonts.title8(
                              color: Color.fromRGBO(0, 0, 0, 0.7))),
                      GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Text(translate("cancel"),
                              style: AppFonts.title8(
                                  color: Color.fromRGBO(0, 0, 0, 0.25))))
                    ]))),
        body: Column(children: [
          Padding(
              padding: EdgeInsets.symmetric(horizontal: 19.w),
              child: Divider(color: Color.fromRGBO(0, 0, 0, 0.2))),
          Expanded(
              child: ListView.separated(
                  padding: EdgeInsets.symmetric(horizontal: 19.w),
                  itemCount: _values.length,
                  separatorBuilder: (context, index) =>
                      Divider(color: Color.fromRGBO(0, 0, 0, 0.2)),
                  itemBuilder: (context, i) {
                    return ListTile(
                        contentPadding: EdgeInsets.zero,
                        enabled: true,
                        onTap: () => setState(() =>
                            _values[i].isSelected = !_values[i].isSelected),
                        selected: _values[i].isSelected,
                        title: Text(translate(_values[i].data),
                            style: AppFonts.title8(color: Color(0xFF4D4D4D))),
                        trailing: _values[i].isSelected
                            ? Icon(Icons.radio_button_checked,
                                color: Color(0xFFE1A854))
                            : Icon(Icons.radio_button_unchecked,
                                color: Color.fromRGBO(0, 0, 0, 0.25)));
                  })),
          CustomButton(
              buttonName: translate("apply"),
              width: 107.04.w,
              height: 41.h,
              color: Color(0xFF426676),
              textStyle: AppFonts.title7Odd(color: Colors.white),
              borderRadius: 34,
              onButtonPressed: () {
                Navigator.pop(context);
                widget.callback(
                    context,
                    _values
                        .where((_) => _.isSelected)
                        .map((_) => _.data)
                        .toList());
              }),
          SizedBox(height: 10.h)
        ]));
  }
}
