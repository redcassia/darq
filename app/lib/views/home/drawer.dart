import 'package:darq/backend/chat.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants/asset_path.dart';
import 'package:darq/utils/helpers/screen_dimensions_helper.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/community_page.dart';
import 'package:darq/views/screens/about_us.dart';
import 'package:darq/views/screens/change_lang.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/chat_list.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/listing_page.dart';
import 'package:darq/views/home/home_page_.dart';
import 'package:darq/views/walk_through/select_language_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/explore_page.dart';

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
        height: ScreenDimensionsHelper.getScreenHeight,
        width: ScreenDimensionsHelper.getScreenWidth - 100.w,
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        decoration: BoxDecoration(
            color: Color(AppColors.alabaster),
            borderRadius: Localizations.localeOf(context).languageCode == 'en'
                ? BorderRadius.only(topRight: Radius.circular(5.w))
                : BorderRadius.only(topLeft: Radius.circular(5.w))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: <
            Widget>[
          SizedBox(height: 58.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.end ,
            children: [
              RotatedBox(
                quarterTurns:
                Localizations.localeOf(context).languageCode == 'en'
                    ? 0
                    : 2,
                child: Image(
                    image: AssetImage(AssetPath.ImgPath + "menu.png"),
                    width: 19.5.w,
                    fit: BoxFit.fitHeight),
              ),
            ],
          ),
          DrawerItem(
              txt: translate("home"),
              icon: "home.png",
              textStyle: AppFonts.title7(
                  color: Color(AppColors.pickledBlueWood),
                  fontWeight: FontWeight.w600),
              onPress: () => Navigator.pop(context)),
          DrawerItem(
              txt: translate("community"),
              icon: "community.png",
              onPress: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => CommunityPage()))),
          DrawerItem(
              txt: translate("events"),
              icon: "events.png",
              onPress: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "events.json")))),
          DrawerItem(
              txt: translate("cuisine"),
              icon: "cuisine.png",
              onPress: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "cuisine.json")))),
          DrawerItem(
              txt: translate("entertainment"),
              icon: "entertainment.png",
              onPress: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "entertainment.json")))),
          DrawerItem(
              txt: translate("child_education_centers"),
              icon: "children_education_centers.png",
              onPress: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => ListingPage(
                          jsonFile: "child_education_centers.json")))),
          DrawerItem(
              txt: translate("made_in_qatar"),
              icon: "made_in_qatar.png",
              onPress: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListingPage(jsonFile: "made_in_qatar.json")))),
          DrawerItem(
              txt: translate("messages"),
              icon: "messages.png",
              numberOfUnseenMsgs: numberOfUnseenMsgs,
              onPress: () => Navigator.push(context,
                          MaterialPageRoute(builder: (context) => ChatList()))
                      .then((_) {
                    numberOfUnseenMsgs = 0;
                    _updateThreads(false);
                  })),
          DrawerItem(
              txt: translate("change_lang"),
              icon: "settings.png",
              onPress: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChangeLang()))),
          DrawerItem(
              txt: translate("about_app"),
              icon: "about_us.png",
              onPress: () => Navigator.push(
                  context, MaterialPageRoute(builder: (context) => AboutUs()))),
        ]));
  }
}

class DrawerItem extends StatelessWidget {
  const DrawerItem(
      {@required this.txt,
      this.textStyle,
      this.onPress,
      this.icon,
      this.numberOfUnseenMsgs = 0,
      Key key})
      : super(key: key);

  final String txt;
  final TextStyle textStyle;
  final VoidCallback onPress;
  final String icon;
  final int numberOfUnseenMsgs;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Padding(
            padding: EdgeInsets.only(top: 30.h),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Image(
                      width: 20.w,
                      fit: BoxFit.fill,
                      image: AssetImage(AssetPath.ImgPath + icon)),
                  SizedBox(width: 15.w),
                  Flexible(
                      child: Text(txt,
                          style: textStyle ??
                              AppFonts.title7(color: Color(AppColors.atoll)))),
                  SizedBox(width: 10.w),
                  Visibility(
                      visible: numberOfUnseenMsgs == 0 ? false : true,
                      child: Stack(children: <Widget>[
                        Icon(Icons.notifications, size: 25.w),
                        Positioned(
                            top: 0.0,
                            right: 0.0,
                            child: Container(
                                decoration: BoxDecoration(
                                    shape: BoxShape.circle, color: Colors.red),
                                child: Padding(
                                    padding: EdgeInsets.all(3.w),
                                    child: Text(numberOfUnseenMsgs.toString(),
                                        style: AppFonts.text10(
                                            color: Colors.white)))))
                      ]))
                ])),
        onTap: onPress);
  }
}
