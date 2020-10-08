import 'dart:convert';
import 'dart:io';

import 'package:chewie/chewie.dart';
import 'package:chewie/src/chewie_player.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/presentation/custom_icons.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/button.dart';
import 'package:darq/views/shared/default_card.dart';
import 'package:darq/views/shared/drawer/combo_burger.dart';
import 'package:darq/views/shared/drawer/drawer.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:link/link.dart';
import 'package:twitter_api/twitter_api.dart';
import 'package:video_player/video_player.dart';
import 'package:webview_flutter/webview_flutter.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  int _currentIndex = 0;
  int liveOrientation = 4;
  String _screenTitle;
  bool _showBottomNavBar = true;
  IconData orientation = Icons.fullscreen;
  static ChewieController _chewieController;
  static VideoPlayerController _controller;
  List<Widget> _children;
  String consumerApiKey = "dlBPaKPqJjtl7BoUfqs6GkdDM";
  String consumerApiSecret =
      "6hCeiXyQcu4jVNYVABLB1B3g25C8WmbDCbmKPtye4B81Ic3knc";
  String accessToken = "1303130664905179143-bLIig9lBe2ZNWO0bM5UrSriOkBcbKm";
  String accessTokenSecret = "YYIPpyfI9HsxSVm4fw2dLqjTNh8KqnXODAyEBGngYWkH5";
  dynamic _twitterAuth;
  List<dynamic> tweets;
  String start = "\"";
  String end = "\"";

  void initializeChewieController() {
    _chewieController = ChewieController(
      autoInitialize: true,
      videoPlayerController: _controller,
      aspectRatio: 3 / 2,
      allowMuting: true,
      fullScreenByDefault: true,
    );
  }

  Future getTwitterNews() async {
    _twitterAuth = new twitterApi(
        consumerKey: consumerApiKey,
        consumerSecret: consumerApiSecret,
        token: accessToken,
        tokenSecret: accessTokenSecret);
    const List<String> sources = ["AJABreaking", "ajmubasher", "MOI_Qatar"];
    Future.wait(sources.map((src) async {
      var result = await _twitterAuth.getTwitterRequest(
          // Http Method
          "GET",
          // Endpoint you are trying to reach
          "statuses/user_timeline.json",
          // The options for the request
          options: {
            "screen_name": src,
            "count": "20",
            "tweet_mode": "extended", // Used to prevent truncating tweets
          });
      return json.decode(result.body);
    })).then((t) {
      t = t.expand((_) => _).toList();
      t.sort((a, b) {
        var x = a["created_at"].split(' ');
        x.removeAt(4);
        var y = b["created_at"].split(' ');
        y.removeAt(4);
        return HttpDate.parse(x.join(' '))
                .compareTo(HttpDate.parse(y.join(' '))) *
            -1;
      });
      setState(() {
        tweets = t;
      });
    });
  }

  @override
  void initState() {
    super.initState();

    getTwitterNews();

    _controller = VideoPlayerController.network(
        'http://qtv-i.akamaihd.net/hls/live/213233/QTV/master360p.m3u8');
    initializeChewieController();
  }

  @override
  void dispose() {
    _controller.dispose();
    _chewieController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _screenTitle = translate("news");
    ScreenUtil.init(context, width: 375, height: 667, allowFontScaling: true);
    _children = [
      Tweets(tweets: tweets, start: start, end: end),
      WebView(
        initialUrl: 'https://www.qe.com.qa/wp/mws/tabs/tab1',
        javascriptMode: JavascriptMode.unrestricted,
        navigationDelegate: (NavigationRequest request) {
          if (request.url.startsWith('https://www.youtube.com/')) {
            print('blocking navigation to $request}');
            return NavigationDecision.prevent;
          }
          print('allowing navigation to $request');
          return NavigationDecision.navigate;
        },
        onPageStarted: (String url) {
          print('Page started loading: $url');
        },
        onPageFinished: (String url) {
          print('Page finished loading: $url');
        },
        gestureNavigationEnabled: true,
      ),
      Center(
          child: Chewie(
        controller: _chewieController,
      ))
    ];

    return Scaffold(
        key: _scaffoldKey,
        extendBodyBehindAppBar: false,
        backgroundColor: Color(0xFFE5E5E5),
        drawer: CustomDrawer(),
        appBar: PreferredSize(
            preferredSize:
                Size(double.infinity, ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: true,
                title: _screenTitle,
                bgImage: Localizations.localeOf(context).languageCode == 'en'
                    ? "rounded_app_bar.png"
                    : "rounded_app_bar_left.png",
                leading: ComboBurger(),
                trailing: CustomButton(
                    borderRadius: 20.0,
                    textStyle: AppFonts.tinyTitle(color: Colors.white),
                    buttonName: translate("add_your_business_button"),
                    height: 27.h,
                    width: 64.w,
                    color: Color(0xFFE1A854),
                    onButtonPressed: () => print("pressed")),
                onLeadingClicked: () =>
                    _scaffoldKey.currentState.openDrawer())),
        body: _children[_currentIndex],
        bottomNavigationBar: Theme(
            data: Theme.of(context).copyWith(canvasColor: Color(0xFF86C2C2)),
            child: _showBottomNavBar
                ? BottomNavigationBar(
                    currentIndex: _currentIndex, // thi
                    selectedItemColor: Color(0XFF426676),
                    unselectedItemColor: Colors.white,
                    selectedLabelStyle:
                        AppFonts.title9(color: Color(0XFF426676)),
                    onTap: (int index) {
                      setState(() {
                        _currentIndex = index;

                        _currentIndex == 2
                            ? _chewieController.play()
                            : _chewieController.pause();
                        _currentIndex == 1
                            ? _showBottomNavBar = false
                            : _showBottomNavBar = true;

                        if (_currentIndex == 0)
                          _screenTitle = translate("news");
                        else if (_currentIndex == 1)
                          _screenTitle = translate("stock_exchange");
                        else if (_currentIndex == 2)
                          _screenTitle = translate("qatar_live");
                      });
                    },
                    showSelectedLabels: true,
                    showUnselectedLabels: false,
                    elevation: 50,
                    iconSize: 27.w,
                    items: [
                        BottomNavigationBarItem(
                            icon: Icon(CustomIcons.newspaper),
                            title: Text(translate("news"))),
                        BottomNavigationBarItem(
                            icon: Icon(Icons.trending_up),
                            title: Text(translate("stock_exchange"))),
                        BottomNavigationBarItem(
                            icon: Icon(Icons.live_tv),
                            title: Text(translate("live")))
                      ])
                : Container(height: 0)));
  }
}

class Tweets extends StatelessWidget {
  const Tweets({
    Key key,
    @required this.tweets,
    @required this.start,
    @required this.end,
  }) : super(key: key);

  final List tweets;
  final String start;
  final String end;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        shrinkWrap: true,
        padding: EdgeInsets.zero,
        itemCount: tweets?.length ?? 0,
        itemBuilder: (BuildContext context, int i) {
          return Padding(
              padding: EdgeInsets.only(top: 10.h),
              child: DefaultCard(
                  margin: EdgeInsets.only(right: 20.w, left: 20.w, bottom: 2.h),
                  padding: Localizations.localeOf(context).languageCode == 'en'
                      ? EdgeInsets.only(
                          left: 13.w, right: 28.w, top: 9.w, bottom: 15.h)
                      : EdgeInsets.only(
                          left: 28.w, right: 13.w, top: 9.w, bottom: 15.h),
                  child: Column(children: [
                    Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Image.network(
                              tweets[i]["user"]["profile_image_url_https"]),
                          SizedBox(width: 17.w),
                          Expanded(
                              child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                Text(tweets[i]["user"]["screen_name"],
                                    style: AppFonts.title9(
                                        color: Color.fromRGBO(0, 0, 0, 0.7))),
                                Link(
                                  child: Text(
                                      tweets[i]["source"].substring(
                                          tweets[i]["source"].indexOf(start) +
                                              start.length,
                                          tweets[i]["source"].indexOf(
                                              end,
                                              tweets[i]["source"]
                                                      .indexOf(start) +
                                                  start.length)),
                                      style: AppFonts.title10OddUnderlined(
                                          color:
                                              Color.fromRGBO(0, 0, 0, 0.37))),
                                  url: tweets[i]["source"].substring(
                                      tweets[i]["source"].indexOf(start) +
                                          start.length,
                                      tweets[i]["source"].indexOf(
                                          end,
                                          tweets[i]["source"].indexOf(start) +
                                              start.length)),
                                ),
                                Padding(
                                    padding:
                                        EdgeInsets.only(left: 10.w, top: 10.h),
                                    child: Text(tweets[i]["full_text"],
                                        textAlign: TextAlign.right,
                                        style: AppFonts.text6w500(
                                            color:
                                                Color.fromRGBO(0, 0, 0, 0.69))))
                              ]))
                        ])
                  ])));
        });
  }
}
