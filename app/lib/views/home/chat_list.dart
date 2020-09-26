import 'dart:convert';
import 'dart:ui';
import 'package:intl/intl.dart';

import 'package:darq/backend.dart';
import 'package:darq/chat.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/views/home/chat_room.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:darq/views/shared/custom_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';
import 'package:darq/views/shared/image_container.dart';

class ChatList extends StatefulWidget {
  @override
  _ChatListState createState() => _ChatListState();
}

class _ChatListState extends State<ChatList> {
  List<MessageThread> _chats = new List();
  Chat chats;

  @override
  void initState() {
    super.initState();
    chats = new Chat();
    chats.getThreads().then((threads) {
       setState(() => _chats.addAll(threads));
    });
  }

  String formatDate(DateTime val) {
    return DateFormat("dd / MM / y  \u2014  hh:mm a", "en_US")
        .format(val.toLocal()).toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: "Your chats",
                bgImage: "app_bar_rectangle.png",
                leading: RightRoundedCapsule(
                    iconBgColor: Color.fromRGBO(134, 194, 194, 0.69),
                    verticalPadding: 5.h,
                    horizontalPadding: 19.w,
                    icon: Image(
                        width: 9.73.w,
                        fit: BoxFit.fill,
                        image: AssetImage(PathFiles.ImgPath + "back.png"))),
                onLeadingClicked: () => Navigator.pop(context))),
        body: ListView.separated(
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            itemCount: _chats?.length ?? 0,
            separatorBuilder: (BuildContext context, int index) => Divider(height: 1,color: Colors.black12,),
            itemBuilder: (BuildContext context, int index) {
              return InkWell(
                  onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              ChatRoom(threadId: _chats[index].id))),
                  child: Padding(
                      padding: EdgeInsets.symmetric(
                          vertical: 10.h, horizontal: 20.w),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Picture(
                                    height: 42.h,
                                    width: 42.w,
                                    img: _chats[index].targetPicture),
                                SizedBox(width: 10.w),
                                Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(_chats[index].targetName,
                                          style: AppFonts.title9(
                                              color: Color.fromRGBO(
                                                  0, 0, 0, 0.7))),
                                      SizedBox(height: 2.h),
                                      Text(_chats[index].messages.last.msg,
                                          style: AppFonts.text6w500(
                                              color:
                                                  Color.fromRGBO(0, 0, 0, 0.5)),
                                          overflow: TextOverflow.ellipsis)
                                    ])
                              ]),
                          Text(formatDate(_chats[index].messages.last.time),
                              style: AppFonts.text10(
                                  color: Color.fromRGBO(0, 0, 0, 0.5)))
                        ],
                      )));
            }));
  }
}
