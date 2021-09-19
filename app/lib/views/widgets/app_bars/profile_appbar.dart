// import 'dart:ui';
//
// import 'package:darq/elements/app_fonts.dart';
// import 'package:darq/constants/asset_path.dart';
// import 'package:darq/views/screens/chat_room.dart';
// import 'package:darq/views/screens/rating_screen.dart';
// import 'package:darq/views/widgets/app_bars/back_arrow.dart';
// import 'package:darq/views/widgets/button.dart';
// import 'package:darq/views/widgets/rounded_capsule.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/rendering.dart';
// import 'package:flutter_screenutil/flutter_screenutil.dart';
// import 'package:flutter_translate/flutter_translate.dart';
//
// class ProfileAppBar extends StatelessWidget {
//   const ProfileAppBar(
//       {Key key,
//       this.backArrowBgColor,
//       this.filterIndicator,
//       this.buttonName,
//       this.filterFunction,
//       this.rateButton = true,
//       this.id})
//       : super(key: key);
//
//   final dynamic id;
//   final Color backArrowBgColor;
//   final bool filterIndicator;
//   final String buttonName;
//   final Function() filterFunction;
//   final bool rateButton;
//
//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//         padding: Localizations.localeOf(context).languageCode == 'en'
//             ? EdgeInsets.only(right: filterIndicator ? 0.w : 14.w, top: 35.h)
//             : EdgeInsets.only(left: filterIndicator ? 0.w : 14.w, top: 35.h),
//         child: Row(
//             mainAxisAlignment: MainAxisAlignment.spaceBetween,
//             children: <Widget>[
//               BackArrow(backArrowBgColor: backArrowBgColor),
//               Row(children: <Widget>[
//                 RoundedButton(
//                     height: 23.h,
//                     padding: 93.w,
//                     buttonName: buttonName,
//                     buttonColor: Color(0xFFE1A854),
//                     borderRadius: 27,
//                     textStyle: AppFonts.title9(color: Colors.white),
//                     onPressed: () => Navigator.push(
//                         context,
//                         MaterialPageRoute(
//                             builder: (context) => ChatRoom(businessId: id)))),
//                 rateButton? RoundedButton(
//                     height: 23.h,
//                     padding: 93.w,
//                     buttonName: translate("rate"),
//                     buttonColor: Color(0xFFE1A854),
//                     borderRadius: 27,
//                     textStyle: AppFonts.title9(color: Colors.white),
//                     onPressed: () => Navigator.push(
//                         context,
//                         MaterialPageRoute(
//                             builder: (context) =>
//                                 RatingScreen(businessId: id)))) : Container(),
//                 filterIndicator
//                     ? InkWell(
//                         onTap: () => filterFunction(),
//                         child: RoundedCapsule(
//                             Localizations.localeOf(context).languageCode == 'en'
//                                 ? "left"
//                                 : "right",
//                             horizontalPadding: 16.w,
//                             verticalPadding: 5.h,
//                             icon: Image(
//                                 fit: BoxFit.fitHeight,
//                                 width: 18.w,
//                                 image: AssetImage(
//                                     AssetPath.ImgPath + "filter.png"))),
//                       )
//                     : Container(height: 0.h)
//               ])
//             ]));
//   }
// }
