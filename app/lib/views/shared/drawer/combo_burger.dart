import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ComboBurger extends StatelessWidget {
  const ComboBurger({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RotatedBox(
        quarterTurns:
            Localizations.localeOf(context).languageCode == 'en' ? 0 : 2,
        child: Image(
            width: 26.w,
            fit: BoxFit.fill,
            image: AssetImage(PathFiles.ImgPath + "combo_burger.png")));
  }
}
