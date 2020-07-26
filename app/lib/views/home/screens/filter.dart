import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/utilities/constants.dart';
import 'dart:ui';
import 'package:flutter/rendering.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/shared/buttons/button.dart';
import 'package:darq/model/item_model_class.dart';

class Filter extends StatefulWidget {
  @override
  _FilterState createState() => _FilterState();
}

class _FilterState extends State<Filter> {
  double padValue = 0;

  List<Items> items = <Items>[
    Items(1, 'Red'),
    Items(2, 'Blue'),
    Items(3, 'Green'),
    Items(4, 'Lime'),
    Items(5, 'Indigo'),
    Items(6, 'Yellow')
  ];

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
                     onTap: ()=> setState((){
                       for(int i=0 ; i<items.length ; i++)
                         items[i].selected = false;
                     }),
                    child: Text("Reset",
                        style: AppFonts.title8(
                            color: Color.fromRGBO(0, 0, 0, 0.25))),
                  ),
                  Text("Filter Your Search",
                      style:
                          AppFonts.title8(color: Color.fromRGBO(0, 0, 0, 0.7))),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Text("Cancel",
                        style: AppFonts.title8(
                            color: Color.fromRGBO(0, 0, 0, 0.25))),
                  )
                ]),
          )),
      body: Column(
        children: [
          Padding(
              padding: EdgeInsets.symmetric(horizontal: 19.w),
              child: Divider(color: Color.fromRGBO(0, 0, 0, 0.2))),
          Expanded(
              child: ListView.separated(
                  padding: EdgeInsets.symmetric(horizontal: 19.w),
                  itemCount: items.length,
                  separatorBuilder: (context, index) =>
                      Divider(color: Color.fromRGBO(0, 0, 0, 0.2)),
                  itemBuilder: (context, index) {
                    return ListTile(
                        contentPadding: EdgeInsets.zero,
                        enabled: true,
                        onTap: () {
                          setState(() {
                            items[index].selected = !items[index].selected;
                          });
                        },
                        selected: items[index].selected,
                        title: Text(items[index].title,
                            style: AppFonts.title8(color: Color(0xFF4D4D4D))),
                        trailing: (items[index].selected)
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
            onButtonPressed: () => {},
          ),
          SizedBox(height: 10.h)
        ],
      ),
    );
  }
}

