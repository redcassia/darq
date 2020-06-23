import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/home/widgets/general_profile_template.dart';

class Community extends StatefulWidget {
  @override
  _CommunityState createState() => _CommunityState();
}

class _CommunityState extends State<Community> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(124.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: "Community",
                bgImage: "rounded_app_bar.png",
                leading: RightRoundedCapsule(
                    iconColor: Color.fromRGBO(134, 194, 194, 0.69),
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                onLeadingClicked: () => Navigator.pop(context))),
        body: SingleChildScrollView(
            child: Center(
                child: Column(children: <Widget>[
          SizedBox(height: 146.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Beauty & Spa",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "beauty_spa.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(
                        title: "Beauty & Spa");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Sports",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "sports.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(
                        title: "Sports", filter: true);
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Limousine",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "limousine.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Limousine");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Hospitality",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "hospitality.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Hospitality");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Cleaning & Maintenance",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "cleaning_maintenance.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Cleaning & Maintenance");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Self Employed",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "self_employed.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Self Employed",filter: true);
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Domestic Help",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "domestic_help.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Domestic Help");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
          CustomButton(
              borderRadius: 29.5,
              buttonName: "Stationeries",
              width: 229.w,
              color: Color(0xFF86C2C2),
              height: 55.h,
              leading: "stationeries.png",
              onButtonPressed: () =>
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return GeneralProfileTemplate(title: "Stationeries");
                  })),
              textStyle: AppFonts.title9(color: Color(0xFF426676))),
          SizedBox(height: 20.h),
        ]))));
  }
}
