import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AppFonts {
  static TextStyle makeStyle(String textSize, Map<String, dynamic> color,
      {FontWeight fontWeight}) {
    var clr = Color.fromRGBO(color["r"], color["g"], color["b"], color["o"]);

    switch (textSize) {
      case "title1":
        return title1(color: clr, fontWeight: fontWeight);
      case "title2":
        return title2(color: clr, fontWeight: fontWeight);
      case "title3":
        return title3(color: clr, fontWeight: fontWeight);
      case "title4":
        return title4(color: clr, fontWeight: fontWeight);
      case "title5":
        return title5(color: clr, fontWeight: fontWeight);
      case "title6":
        return title6(color: clr, fontWeight: fontWeight);
      case "title7":
        return title7(color: clr, fontWeight: fontWeight);
      case "title8":
        return title8(color: clr, fontWeight: fontWeight);
      case "title9":
        return title9(color: clr, fontWeight: fontWeight);
      case "title9Odd":
        return title9Odd(color: clr, fontWeight: fontWeight);
      case "title10":
        return title10(color: clr, fontWeight: fontWeight);
      case "text1":
        return text1(color: clr, fontWeight: fontWeight);
      case "text2":
        return text2(color: clr, fontWeight: fontWeight);
      case "text3":
        return text3(color: clr, fontWeight: fontWeight);
      case "text4":
        return text4(color: clr, fontWeight: fontWeight);
      case "text5":
        return text5(color: clr, fontWeight: fontWeight);
      case "text6":
        return text6(color: clr, fontWeight: fontWeight);
      case "text7":
        return text7(color: clr, fontWeight: fontWeight);
      case "text8":
        return text8(color: clr, fontWeight: fontWeight);
      case "text9":
        return text9(color: clr, fontWeight: fontWeight);
      case "text10":
        return text9(color: clr, fontWeight: fontWeight);
    }
  }

  // use TextStyle in the first screen because it takes time to load GoogleFonts so the user
  // will see the resizing

  static TextStyle title1({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 28.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title2({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 26.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title3({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 24.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title4({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 22.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title5({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 20.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title6({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 18.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title7({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 16.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title8odd({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 15.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title8({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 14.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title9({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 12.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title9Odd({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 11.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle title10({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 10.ssp,
        fontWeight: fontWeight ?? FontWeight.w500,
        color: color);
  }

  static TextStyle text1({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 26.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text2({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 24.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text3({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 22.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text4({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 20.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text5({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 18.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text6({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 16.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text7({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 14.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text8({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 12.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text9odd({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 11.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text9({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 10.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }

  static TextStyle text10({Color color, FontWeight fontWeight}) {
    return TextStyle(
        fontSize: 8.ssp,
        fontWeight: fontWeight ?? FontWeight.normal,
        color: color);
  }
}
