import 'dart:ui';

import 'package:darq/backend.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';

class RatingScreen extends StatefulWidget {
  final String businessId;
  final dynamic rating;

  RatingScreen({this.businessId, this.rating});
  @override
  _RatingScreenState createState() => _RatingScreenState();
}

class _RatingScreenState extends State<RatingScreen> {
  double _rating;

  rateBusiness(int rating) {
    print("rating $rating");
    print("id: ${widget.businessId}");
    Backend.getClient().then((client) => client
            .mutate(MutationOptions(documentNode: gql(r'''
           mutation($id : ID!, $rating:  Int!){
          rateBusiness(
            id: $id,
            stars: $rating
          )
          }  
          '''), variables: {'id': widget.businessId, "rating": rating}))
            .then((result) {
          if (!result.hasException) Navigator.pop(context);
        }));
  }

  @override
  void initState() {
    super.initState();
    _rating = widget.rating?.toDouble() ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                bgImage: "app_bar_rectangle.png",
                leading: RightRoundedCapsule(
                    iconBgColor: Color.fromRGBO(134, 194, 194, 0.69),
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                onLeadingClicked: () => Navigator.pop(context))),
        body: DefaultCard(
            margin: EdgeInsets.only(
                right: 19.w, left: 20.w, bottom: 10.h, top: 10.h),
            padding: EdgeInsets.zero,
            child: Padding(
                padding: EdgeInsets.only(
                    left: 13.w, right: 28.w, top: 30.h, bottom: 30.h),
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text("What's your rate?",
                          style: AppFonts.title7(
                              color: Color.fromRGBO(0, 0, 0, 0.7))),
                      SizedBox(height: 20.h),
                      Image(
                          fit: BoxFit.fitHeight,
                          width: 250.w,
                          height: 140.h,
                          image: AssetImage(PathFiles.ImgPath + "rating.png")),
                      SizedBox(height: 15.h),
                      SmoothStarRating(
                          lockRatingChange: false,
                          mainAxisAlignment: MainAxisAlignment.center,
                          onRatingChanged: (_) => setState(() => _rating = _),
                          allowHalfRating: true,
                          size: 25.w,
                          filledIconData: Icons.star,
                          halfFilledIconData: Icons.star_half,
                          defaultIconData: Icons.star_border,
                          starCount: 5,
                          rating: _rating.toDouble(),
                          borderColor: Color(0xFFE1A854),
                          color: Color(0xFFE1A854),
                          spacing: 0.0),
                      SizedBox(height: 30.h),
                      CustomButton(
                          onButtonPressed: () => rateBusiness(_rating.toInt()),
                          buttonName: "Rate",
                          height: 23.h,
                          width: 93.w,
                          color: Color(0xFF426676),
                          borderRadius: 27,
                          textStyle: AppFonts.title11Odd(color: Colors.white))
                    ]))));
  }
}
