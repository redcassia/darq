import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

class AppFonts {
  static TextStyle superTitle({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(40, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }
  static TextStyle title1({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(30, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title2({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(28, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title3({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(26, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title4({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(24, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title5({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(22, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title6({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(20, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle title7Odd({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(17, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }
  static TextStyle title7({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(18, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }


  static TextStyle title8({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(16, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }
  static TextStyle title9({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(14, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }
  static TextStyle title10({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(10, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }


  static TextStyle title10Odd({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(11, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }
  static TextStyle title10OddUnderlined({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(11, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold, decoration: TextDecoration.underline,
        decorationThickness: 2,
        decorationColor: color,
        color: color);
  }
  static TextStyle tinyTitle({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(8, allowFontScalingSelf: true),
        fontWeight: FontWeight.bold,
        color: color);
  }

  static TextStyle text1({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(26, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text2({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(24, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text3({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(22, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text4({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(20, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text5({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(18, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text6({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(16, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text7({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(14, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }

  static TextStyle text8({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(12, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }
  static TextStyle text6w500({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(12, allowFontScalingSelf: true),
        fontWeight: FontWeight.w500,
        color: color);
  }
  static TextStyle text9({Color color}) {
    return GoogleFonts.roboto(
        fontSize: ScreenUtil().setSp(10, allowFontScalingSelf: true),
        fontWeight: FontWeight.normal,
        color: color);
  }
}
