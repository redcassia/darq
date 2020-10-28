import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

class AppFonts {
  static TextStyle makeStyle(String textSize, Map<String, dynamic> color) {
    var clr = Color.fromRGBO(color["r"], color["g"], color["b"], color["o"]);

    switch (textSize) {
      case "superTitle":            return superTitle(color: clr);
      case "title1":                return title1(color: clr);
      case "title2":                return title2(color: clr);
      case "title3":                return title3(color: clr);
      case "title4":                return title4(color: clr);
      case "title5":                return title5(color: clr);
      case "title6":                return title6(color: clr);
      case "title7":                return title7(color: clr);
      case "title7Odd":             return title7Odd(color: clr);
      case "title8":                return title8(color: clr);
      case "title9":                return title9(color: clr);
      case "title10":               return title10(color: clr);
      case "title10OddUnderlined":  return title10OddUnderlined(color: clr);
      case "title11":               return title11(color: clr);
      case "title11Odd":            return title11Odd(color: clr);
      case "tinyTitle":             return tinyTitle(color: clr);
      case "text1":                 return text1(color: clr);
      case "text2":                 return text2(color: clr);
      case "text3":                 return text3(color: clr);
      case "text4":                 return text4(color: clr);
      case "text5":                 return text5(color: clr);
      case "text6":                 return text6(color: clr);
      case "text6w500":             return text6w500(color: clr);
      case "text7":                 return text7(color: clr);
      case "text8":                 return text8(color: clr);
      case "text8w500":             return text8w500(color: clr);
      case "text9odd":              return text9odd(color: clr);
      case "text10":                return text10(color: clr);
      case "text10w500":            return text10w500(color: clr);
    }
  }

  // use TextStyle in the first screen because it takes time to load GoogleFonts so the user
  // will see the resizing

  static TextStyle superTitle({Color color}) {
    return TextStyle(
      fontFamily: 'Roboto',
        fontSize: 40.ssp, fontWeight: FontWeight.bold, color: color);
  }

  static TextStyle title1({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 30.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title2({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 28.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title3({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 26.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title4({Color color}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 24.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title5({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 22.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title6({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 20.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title7Odd({Color color}) {
    return TextStyle(
        fontFamily: 'Roboto',
        fontSize: 17.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title7({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 18.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title8({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 16.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title9({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 14.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title10({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 12.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title11({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 10.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title11Odd({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 11.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title10OddUnderlined({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 11.ssp,
        fontWeight: FontWeight.bold,
        decoration: TextDecoration.underline,
        decorationThickness: 2,
        decorationColor: color,
        color: color);
  }

  static TextStyle tinyTitle({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 8.ssp,
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle text1({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 26.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text2({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 24.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text3({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 22.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text4({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 20.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text4w700({Color color}) {
    return GoogleFonts.roboto(
        fontSize:20.ssp,
        fontWeight: FontWeight.w700,
        color: color);
  }

  static TextStyle text5({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 18.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text5w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 18.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }

  static TextStyle text6({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 16.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text6w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 16.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }

  static TextStyle text7({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 14.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text7w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 14.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }

  static TextStyle text8({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 12.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text8w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 12.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }

  static TextStyle text9odd({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 11.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }

  static TextStyle text10({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 10.ssp,
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text10w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: 10.ssp,
        fontWeight: FontWeight.w500,
        color: color);
  }
}
