import 'package:flutter/material.dart';

class RoundedButton extends StatelessWidget {
  const RoundedButton(
      {@required this.buttonName,
      this.buttonColor,
      this.onPressed,
      this.padding,
      this.height,
      this.textStyle,
      this.borderRadius,
      Key key})
      : super(key: key);

  final String buttonName;
  final Color buttonColor;
  final VoidCallback onPressed;
  final double height;

  /// left and right padding
  final double padding;
  final TextStyle textStyle;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: FlatButton(
          onPressed: onPressed,
          color: buttonColor,
          child: Text(buttonName, style: textStyle),
          padding: EdgeInsets.symmetric(horizontal: padding),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          )),
    );
  }
}
