import 'dart:convert';
import 'dart:io';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/presentation/custom_icons.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/utilities/screen_info.dart';
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
import 'package:webview_flutter/webview_flutter.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  final String DARQ_WEBSITE = "darq.qa";

  int _currentIndex = 0;
  int position = 1;
  bool circularProgressIndicator = true;
  bool _showBottomNavBar = true;

  dynamic _twitterAuth;

  String consumerApiKey = "dlBPaKPqJjtl7BoUfqs6GkdDM";
  String consumerApiSecret =
      "6hCeiXyQcu4jVNYVABLB1B3g25C8WmbDCbmKPtye4B81Ic3knc";
  String accessToken = "1303130664905179143-bLIig9lBe2ZNWO0bM5UrSriOkBcbKm";
  String accessTokenSecret = "YYIPpyfI9HsxSVm4fw2dLqjTNh8KqnXODAyEBGngYWkH5";

  String start = "\"";
  String end = "\"";
  String _screenTitle;

  List<dynamic> _tweets;
  List<Widget> _tabs;

  double screenWidth;

  @override
  void initState() {
    super.initState();
    _screenTitle = "news";
    getTwitterNews();
  }

  @override
  void dispose() {
    super.dispose();
  }

  showAlertDialog(BuildContext context) {
    showDialog(
        context: context,
        barrierColor: Colors.black.withOpacity(0.8),
        builder: (BuildContext context) {
          return Center(
              child: Container(
                  margin: EdgeInsets.all(20.w),
                  padding: EdgeInsets.symmetric(vertical: 33.h),
                  decoration: BoxDecoration(
                      color: Color(0xFFFFFFFF),
                      borderRadius:
                          Localizations.localeOf(context).languageCode == 'en'
                              ? BorderRadius.only(
                                  topLeft: Radius.circular(40),
                                  bottomRight: Radius.circular(40),
                                )
                              : BorderRadius.only(
                                  topRight: Radius.circular(40),
                                  bottomLeft: Radius.circular(40))),
                  child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 30.w),
                      child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Image(
                                image: AssetImage(
                                    PathFiles.ImgPath + "add_ur_business.png")),
                            SizedBox(height: 19.h),
                            RichText(
                                textAlign: TextAlign.center,
                                text: TextSpan(
                                    style: AppFonts.text7w500(
                                        color: Color(0xFF4D4D4D)),
                                    children: <TextSpan>[
                                      TextSpan(text: translate("if_you_wish")),
                                      TextSpan(
                                          text: translate("darq"),
                                          style: AppFonts.text7w500(
                                              color: Color(0xFF476C7B))),
                                      TextSpan(text: translate("please_visit")),
                                      TextSpan(
                                          text: " $DARQ_WEBSITE",
                                          style: AppFonts.text7w500(
                                              color: Color(0xFF476C7B))),
                                      TextSpan(
                                          text:
                                              translate("using_your_computer"))
                                    ]))
                            // dialog bottom
                          ]))));
        });
  }

  Future getTwitterNews() async {
    _twitterAuth = twitterApi(
        consumerKey: consumerApiKey,
        consumerSecret: consumerApiSecret,
        token: accessToken,
        tokenSecret: accessTokenSecret);
    const List<String> sources = [
      "AJABreaking",
      "Qatar_Edu",
      "ajmubasher",
      "MOI_Qatar",
      "MOTC_QA",
      "HukoomiQatar",
      "QF",
      "NTC_Qatar",
      "AwqafM",
      "MOCIQatar",
      "qatarairwaysar",
      "qatarpetroleum",
      "ADLSAQa",
      "ahalqatar"
    ];
    Future.wait(sources.map((src) async {
      var result = await _twitterAuth.getTwitterRequest(
          // Http Method
          "GET",
          // Endpoint you are trying to reach
          "statuses/user_timeline.json",
          // The options for the request
          options: {
            "screen_name": src,
            "count": "10",
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
        position = 0;
        _tweets = t;
      });
    });
  }

  startLoading(String url) {
    setState(() => position = 1);
  }

  doneLoading(String url) {
    setState(() => position = 0);
  }

  @override
  Widget build(BuildContext context) {
    ScreenUtil.init(context,
        designSize: Size(375, 667), allowFontScaling: true);
    _tabs = [
      Loading(
          position: position,
          child: Tweets(tweets: _tweets, start: start, end: end)),
      Loading(
          position: position,
          child: WebView(
              initialUrl: 'https://www.qe.com.qa/wp/mws/tabs/tab1',
              javascriptMode: JavascriptMode.unrestricted,
              navigationDelegate: (NavigationRequest request) {
                if (request.url.startsWith('https://www.youtube.com/') ||
                    request.url.startsWith('https://www.google.com/')) {
                  return NavigationDecision.prevent;
                }
                return NavigationDecision.navigate;
              },
              onPageStarted: startLoading,
              onPageFinished: doneLoading,
              gestureNavigationEnabled: true)),
      Loading(
          position: position,
          child: Center(
              child: AspectRatio(
                  aspectRatio: 3 / 2,
                  child: WebView(
                      initialUrl: Uri.dataFromString(
                              '<html><body><iframe style="width:100%;height:100%;top:0;left:0;position:absolute;" src="https://www.youtube.com/embed/taAYP6uAGvs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></body></html>',
                              mimeType: 'text/html')
                          .toString(),
                      onPageStarted: startLoading,
                      onPageFinished: doneLoading,
                      javascriptMode: JavascriptMode.unrestricted))))
    ];

    return Scaffold(
        key: _scaffoldKey,
        extendBodyBehindAppBar: false,
        backgroundColor: _currentIndex == 1 ? Colors.white : Color(0xFFE5E5E5),
        drawer: CustomDrawer(),
        appBar: PreferredSize(
            preferredSize:
                Size(double.infinity, ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                bgColor: _currentIndex == 1 ? Colors.white : null,
                allowHorizontalPadding: true,
                title: translate(_screenTitle),
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
                    onButtonPressed: () => showAlertDialog(context)),
                onLeadingClicked: () {
                  _scaffoldKey.currentState.openDrawer();
                })),
        body: _tabs[_currentIndex],
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
                        position = 1;
                        _currentIndex = index;
                        switch (_currentIndex) {
                          case 0:
                            getTwitterNews();
                            _screenTitle = "news";
                            _showBottomNavBar = true;
                            break;
                          case 1:
                            _screenTitle = "stock_exchange";
                            _showBottomNavBar = false;

                            break;
                          case 2:
                            _screenTitle = "live";
                            _showBottomNavBar = true;

                            break;
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

class Loading extends StatelessWidget {
  const Loading({Key key, @required this.position, @required this.child})
      : super(key: key);

  final int position;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return IndexedStack(
        index: position,
        children: [child, Center(child: CircularProgressIndicator())]);
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
