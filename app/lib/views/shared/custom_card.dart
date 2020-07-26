import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DefaultCard extends StatelessWidget {
  const DefaultCard({Key key,this.color, @required this.child, this.margin, this.padding}) : super(key: key);

  final Widget child;
 final EdgeInsets margin;
 final EdgeInsets padding;
 final Color color;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20), bottomRight: Radius.circular(20)),
        child: Container(
            width: double.infinity,
            margin: margin,
            decoration: BoxDecoration(
                color: color?? Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.37),
                      blurRadius: 5.0,
                      offset: Offset(1, 1))
                ],
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20))),
            child: Padding(
                padding: padding,
                child: child)));
  }
}
