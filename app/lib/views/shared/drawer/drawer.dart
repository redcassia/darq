import 'package:darq/backend/chat.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/home/screens/about_us.dart';
import 'package:darq/views/home/screens/change_lang.dart';
import 'package:darq/views/home/screens/chat_list.dart';
import 'package:darq/views/home/screens/community.dart';
import 'package:darq/views/home/screens/home.dart';
import 'package:darq/views/home/screens/listing_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class CustomDrawer extends StatefulWidget {
  const CustomDrawer({Key key}) : super(key: key);

  @override
  _CustomDrawerState createState() => _CustomDrawerState();
}

class _CustomDrawerState extends State<CustomDrawer> {
  List<MessageThread> _chats = new List();
  Chat chats;
  int unseenMessages;
  static int numberOfUnseenMsgs = 0;

  void _updateThreads(bool refresh) {
    chats.getThreads(refresh: refresh).then((threads) {
      _chats = threads;
      numberOfUnseenMsgs = 0;
      if (mounted) {
        for (int i = 0; i < _chats.length; i++) {
          if (checkLastSeen(_chats[i]))
            numberOfUnseenMsgs =
                numberOfUnseenMsgs + numberOfUnseenMessages(_chats[i]);
        }
        setState(() {});
      }
      if (refresh)
        Future.delayed(Duration(seconds: 30), () => _updateThreads(true));
    });
  }

  @override
  void initState() {
    super.initState();
    chats = new Chat();
    _updateThreads(true);
  }

  bool checkLastSeen(MessageThread msg) {
    return msg.messages.last.index > msg.senderLastSeenIndex;
  }

  int numberOfUnseenMessages(MessageThread msg) {
    return msg.messages.last.index - msg.senderLastSeenIndex;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        height: SI.screenHeight,
        width: SI.screenWidth - 60.w,
        decoration: BoxDecoration(
            color: Color(0xFF86C2C2),
            borderRadius: Localizations.localeOf(context).languageCode == 'en'
                ? BorderRadius.only(topRight: Radius.circular(80.w))
                : BorderRadius.only(topLeft: Radius.circular(80.w))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: <
            Widget>[
          SizedBox(height: 15.h),
          DrawerItem(
              txt: translate("home"),
              icon: "home.png",
              onClick: () => Navigator.push(
                  context, MaterialPageRoute(builder: (context) => Home()))),
          DrawerItem(
              txt: translate("community"),
              icon: "community.png",
              onClick: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => Community()))),
          DrawerItem(
              txt: translate("events"),
              icon: "events.png",
              onClick: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "events.json")))),
          DrawerItem(
              txt: translate("cuisine"),
              icon: "cuisine.png",
              onClick: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "cuisine.json")))),
          DrawerItem(
              txt: translate("entertainment"),
              icon: "entertainment.png",
              onClick: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "entertainment.json")))),
          DrawerItem(
              txt: translate("child_education_centers"),
              icon: "education_center.png",
              onClick: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => ListingPage(
                          jsonFile: "child_education_centers.json")))),
          DrawerItem(
              txt: translate("made_in_qatar"),
              icon: "made_in_qatar.png",
              onClick: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "made_in_qatar.json")))),
          DrawerItem(
              txt: translate("messages"),
              icon: "chat.png",
              numberOfUnseenMsgs: numberOfUnseenMsgs,
              onClick: () => Navigator.push(context,
                          MaterialPageRoute(builder: (context) => ChatList()))
                      .then((_) {
                    numberOfUnseenMsgs = 0;
                    _updateThreads(false);
                  })),
          DrawerItem(
              txt: translate("change_lang"),
              icon: "settings.png",
              onClick: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChangeLang()))),
          DrawerItem(
              txt: translate("about_us"),
              icon: "about_us.png",
              onClick: () => Navigator.push(
                  context, MaterialPageRoute(builder: (context) => AboutUs()))),
        ]));
  }
}

class DrawerItem extends StatelessWidget {
  const DrawerItem(
      {@required this.txt,
      this.onClick,
      this.icon,
      this.numberOfUnseenMsgs = 0,
      Key key})
      : super(key: key);

  final String txt;
  final Function onClick;
  final String icon;
  final int numberOfUnseenMsgs;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Padding(
            padding: EdgeInsets.only(top: 30.h, left: 20.w, right: 25.w),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Image(
                      width: 23.w,
                      height: 23.w,
                      fit: BoxFit.fill,
                      image: AssetImage(PathFiles.ImgPath + icon)),
                  SizedBox(width: 15.w),
                  Flexible(
                    child: Text(txt,
                        style: AppFonts.title7(color: Color(0xFF426676))),
                  ),
                  SizedBox(width: 10.w),
                  Visibility(
                    visible: numberOfUnseenMsgs == 0 ? false : true,
                    child: Stack(children: <Widget>[
                      Icon(Icons.notifications, size: 25.w),
                      Positioned(
                        // draw a red marble
                          top: 0.0,
                          right: 0.0,
                          child: Container(
                              decoration: BoxDecoration(
                                  shape: BoxShape.circle, color: Colors.red),
                              child: Padding(
                                  padding: EdgeInsets.all(3.w),
                                  child: Text(numberOfUnseenMsgs.toString(),
                                      style:
                                      AppFonts.text11(color: Colors.white)))))
                    ]),
                  ),
                ])),
        onTap: () => onClick());
  }
}
