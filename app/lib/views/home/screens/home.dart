import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/drawer/drawer.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/presentation/custom_icons.dart';
import 'package:darq/views/shared/drawer/combo_burger.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:chewie/src/chewie_player.dart';
import 'package:darq/utilities/constants.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  int _currentIndex = 0;
  int liveOrientation = 4;
  IconData orientation = Icons.fullscreen;
  static ChewieController _chewieController;
  static VideoPlayerController _controller;
  List<Widget> _children;

  @override
  void initState() {
    super.initState();

    _controller = VideoPlayerController.network(
        'http://qtv-i.akamaihd.net/hls/live/213233/QTV/master360p.m3u8');
    _chewieController = ChewieController(
      autoInitialize: true,
      videoPlayerController: _controller,
      aspectRatio: 3 / 2,
      fullScreenByDefault: true,
      allowMuting: true,
    );

    _children = [
      Text("trending news.."),
      Text("Aviation"),
      Text("Stock"),
      Center(
          child: Chewie(
        controller: _chewieController,
      ))
    ];
  }

  @override
  void dispose() {
    _controller.dispose();
    _chewieController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ScreenUtil.init(context, width: 375, height: 667, allowFontScaling: true);
    return Scaffold(
        key: _scaffoldKey,
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.white,
        drawer: CustomDrawer(),
        appBar: PreferredSize(
            preferredSize: Size(double.infinity, ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: true,
                title: "Trending News",
                bgImage: "rounded_app_bar.png",
                leading: ComboBurger(),
                trailing: CustomButton(
                    borderRadius: 20.0,
                    textStyle: AppFonts.tinyTitle(color: Colors.white),
                    buttonName: "Add Your Business",
                    height: 27.h,
                    width: 64.w,
                    color: Color(0xFFE1A854),
                    onButtonPressed: () => print("pressed")),
                onLeadingClicked: () =>
                    _scaffoldKey.currentState.openDrawer())),
        body: _children[_currentIndex],
        bottomNavigationBar: Theme(
            data: Theme.of(context).copyWith(canvasColor: Color(0xFF86C2C2)),
            child: BottomNavigationBar(
                currentIndex: _currentIndex, // thi
                selectedItemColor: Color(0XFF426676),
                unselectedItemColor: Colors.white,
                selectedLabelStyle: AppFonts.title9(color: Color(0XFF426676)),
                onTap: (int index) {
                  setState(() {
                    _currentIndex = index;
                    if (_currentIndex != 3) {
                      _controller.pause();
                    }
                  });
                },
                showSelectedLabels: true,
                showUnselectedLabels: false,
                elevation: 50,
                iconSize: 27.w,
                items: [
                  BottomNavigationBarItem(
                      icon: Icon(CustomIcons.newspaper),
                      title: Text("Trending")),
                  BottomNavigationBarItem(
                      icon: Icon(Icons.airplanemode_active),
                      title: Text("AirPorts")),
                  BottomNavigationBarItem(
                      icon: Icon(Icons.trending_up),
                      title: Text("Stock Exchange")),
                  BottomNavigationBarItem(
                      icon: Icon(Icons.live_tv), title: Text("Qatar Live"))
                ])));
  }
}
