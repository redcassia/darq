import 'dart:ui';

import 'package:darq/backend/session.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/views/widgets/button.dart';
import 'package:darq/views/widgets/default_card.dart';
import 'package:darq/views/widgets/star_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';
import 'package:darq/constants/api_path.dart';

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
    Session.getClient().then((client) => client
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
      else print("resultt--->$result");
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
        body: Center(
          child: DefaultCard(
              margin: EdgeInsets.only(
                  right: 20.w, left: 20.w, bottom: 10.h, top: 10.h),
              child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 30.h),
                  child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(translate("what_is_your_rate"),
                            style: AppFonts.title7(
                                color: Color.fromRGBO(0, 0, 0, 0.7),fontWeight: FontWeight.bold)),
                        SizedBox(height: 20.h),
                        Image(
                            fit: BoxFit.fitHeight,
                            width: 250.w,
                            height: 140.h,
                            image: AssetImage(AssetPath.ImgPath + "rating.png")),
                        SizedBox(height: 15.h),
                        SmoothStarRating(
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
                        RoundedButton(
                          buttonName: translate("rate"),
                          onPressed: () => rateBusiness(_rating.toInt()),
                          buttonColor: Color(0xFFF05D48),
                          textStyle: AppFonts.text8(color: Colors.white),
                          height: 30.h,
                          borderRadius: 27.r,
                          padding: 2.w,
                        ),
                      ]))),
        ));
  }
}