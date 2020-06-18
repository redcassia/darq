import 'package:flutter/material.dart';

class CustomClipRRect extends StatelessWidget {
  const CustomClipRRect(
      {Key key,
        @required this.borderRadius,
        @required this.height,
        @required this.width,
        @required this.color,
        @required this.widget})
      : super(key: key);

  final double borderRadius;
  final double height;
  final double width;
  final Color color;
  final Widget widget;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(borderRadius),
          bottomRight: Radius.circular(borderRadius),
        ),
        child: Container(
            height: height,
            width: width,
            margin: EdgeInsets.only(bottom: 6.0, right: 6),
            decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.25),
                      blurRadius: 6.0,
                      offset: Offset(0.0, 0.5))
                ],
                color: color,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(borderRadius),
                  bottomRight: Radius.circular(borderRadius),
                )),
            child: widget));
  }
}
