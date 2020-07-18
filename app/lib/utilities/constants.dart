import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ConsDimensions {
  /// Capsule constants
  static const CapsuleBottomShadow = 5.0;
  static const CapsuleUpperShadow = 1.0;
  static const CapsuleHorizontalShadow = 6.0;
  static const CapsuleRadius = 45.0;
  static const CapsuleBoxShadow = [
    BoxShadow(
        color: Color.fromRGBO(0, 0, 0, 0.25),
        blurRadius: 6.0,
        offset: Offset(0.0, 0.5))
  ];

  /// Button constants
  static const ButtonBottomShadow = 5;
  static const ButtonHorizontalShadow = 2;

  /// AppBar Heights
  static const LargeAppBarHeight = 124.0;
  static const SmallAppBarHeight = 75.0;

  ///Image constants
  static const ImageBottomShadow = 3.0;
  static const ImageRightShadow = 1.0;
}
