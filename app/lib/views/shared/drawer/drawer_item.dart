import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';

class DrawerItem extends StatelessWidget {
  const DrawerItem({@required this.txt, this.onClick, this.icon, Key key})
      : super(key: key);

  final String txt;
  final Function onClick;
  final String icon;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Padding(
            padding: EdgeInsets.only(top: 40.h, left: 20.w, right: 25.w),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Image(
                      width: 23.w,
                      height: 23.w,
                      fit: BoxFit.fill,
                      image: AssetImage(PathFiles.ImgPath + icon)),
                  SizedBox(width: 15.w),
                  Flexible(
                    child: Text(txt,
                        style: AppFonts.title7(color: Color(0xFF426676))),
                  )
                ])),
        onTap: () => onClick());
  }
}
