import 'dart:convert';
import 'dart:ui';

import 'package:darq/backend.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:darq/views/home/screens/personnel_page.dart';
import 'listing_page.dart';

class ListItem<T> {
  bool isSelected = false;
  T data;
  ListItem(this.data);
}

class PersonnelFilter extends StatefulWidget {
  @override
  _PersonnelFilterState createState() => _PersonnelFilterState();
}

class _PersonnelFilterState extends State<PersonnelFilter> {
  List<dynamic> selectedItems = [];
  dynamic _data;
  Map<String, dynamic> _layout;
  List<ListItem> list = [];
  SharedPreferences prefs;

  getLayout() async {
    prefs = await SharedPreferences.getInstance();
    return await jsonDecode(prefs.getString('layout'));
  }

  loadLayoutAndData() {
    getLayout().then((layout) {
      setState(() => _layout = layout);
      Backend.getClient().then((client) => client
          .query(QueryOptions(
          documentNode: gql(_layout["list"]["filter_values_query"])))
          .then((result) {
        if (!result.hasException)
          setState(() {
            _data = result.data["__type"]["enumValues"];
            for (int i = 0; i < _data?.length ?? 0; i++)
              list.add(ListItem(_data[i]));
          });
      }));
    });
  }

  @override
  void initState() {
    super.initState();
    loadLayoutAndData();
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
                                for (int i = 0; i < _data?.length ?? 0; i++)
                                  list[i].isSelected = false;
                              }),
                          child: Text("Reset",
                              style: AppFonts.title8(
                                  color: Color.fromRGBO(0, 0, 0, 0.25)))),
                      Text("Filter Your Search",
                          style: AppFonts.title8(
                              color: Color.fromRGBO(0, 0, 0, 0.7))),
                      GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Text("Cancel",
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
                  itemCount: _data?.length ?? 0,
                  separatorBuilder: (context, index) =>
                      Divider(color: Color.fromRGBO(0, 0, 0, 0.2)),
                  itemBuilder: (context, i) {
                    return ListTile(
                        contentPadding: EdgeInsets.zero,
                        enabled: true,
                        onTap: () => setState(
                            () => list[i].isSelected = !list[i].isSelected),
                        selected: list[i].isSelected,
                        title: Text(_data[i]["name"],
                            style: AppFonts.title8(color: Color(0xFF4D4D4D))),
                        trailing: list[i].isSelected
                            ? Icon(Icons.radio_button_checked,
                                color: Color(0xFFE1A854))
                            : Icon(Icons.radio_button_unchecked,
                                color: Color.fromRGBO(0, 0, 0, 0.25)));
                  })),
          CustomButton(
              buttonName: "Apply",
              width: 107.04.w,
              height: 41.h,
              color: Color(0xFF426676),
              textStyle: AppFonts.title7Odd(color: Colors.white),
              borderRadius: 34,
              onButtonPressed: () {
                for (int i = 0; i < list.length; i++)
                  if (list[i].isSelected)
                    selectedItems.add(list[i].data["name"]);
                personnelKey.currentState
                    .updatePersonnel(selectedValues: selectedItems);
                Navigator.pop(context);
              }),
          SizedBox(height: 10.h)
        ]));
  }
}
