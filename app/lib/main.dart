import 'package:darq/res/path_files.dart';
import 'package:darq/views/intro/welcome.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    precacheImage(
        AssetImage(PathFiles.ImgPath + "select_language_bg.png"), context);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DarQ',
      home: Welcome(),
    );
  }
}
