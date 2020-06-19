import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/star_rating.dart';
import 'package:darq/views/shared/image_container.dart';


class TileContentLeading extends StatelessWidget {
  const TileContentLeading(
      {Key key,
        @required this.rating,
        @required this.profilePic,
        @required this.onRatingChange})
      : super(key: key);

  final double rating;
  final String profilePic;
  final Function(double) onRatingChange;

  @override
  Widget build(BuildContext context) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          CustomProfilePicture(height: 70.w, width: 70.w, img: profilePic),
          SizedBox(height: 3.h),
          SmoothStarRating(
              allowHalfRating: true,
              onRatingChanged: (v) => onRatingChange(v),
              size: 14.w,
              filledIconData: Icons.star,
              halfFilledIconData: Icons.star_half,
              defaultIconData: Icons.star_border,
              starCount: 5,
              rating: rating,
              borderColor: Color(0xFFE1A854),
              color: Color(0xFFE1A854),
              spacing: 0.0)
        ]);
  }
}
