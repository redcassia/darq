import 'package:cached_network_image/cached_network_image.dart';
import 'package:darq/constants/api_path.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class Picture extends StatelessWidget {
  const Picture({
    Key key,
    this.height,
    this.width,
    @required this.photo,
  }) : super(key: key);

  final double width;
  final double height;
  final String photo;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.circular(20.w),
        child: CachedNetworkImage(
            height: height,
            width: width,
            fit: BoxFit.cover,
            imageUrl: APIPath.httpAttachmentPath + photo,
            placeholder: (context, url) => CircularProgressIndicator(),
            errorWidget: (context, url, error) => Icon(Icons.error)));
  }
}
