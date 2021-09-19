import 'dart:async';
import 'dart:ui';

import 'package:darq/backend/chat.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/constants.dart';
import 'package:darq/utils/services/local_storage_time_service.dart';
import 'package:darq/views/screens/chat_room.dart';
import 'package:darq/views/widgets/app_bar.dart';
import 'package:darq/views/widgets/app_bars/back_arrow.dart';
import 'package:darq/views/widgets/app_bars/default_appbar.dart';
import 'package:darq/views/widgets/image_container.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';

class ChatList extends StatefulWidget {
  @override
  _ChatListState createState() => _ChatListState();
}

class _ChatListState extends State<ChatList> {
  List<MessageThread> _chats = new List();
  Chat chats;
  int unseenMessages;

  void _updateThreads(bool refresh) {
    chats.getThreads(refresh: refresh).then((threads) {
      _chats = threads;
      if (mounted) setState(() {});
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
  void dispose() {
    _chats = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar:  PreferredSize(
            preferredSize: Size.fromHeight(90.h),
            child: AppBarCustom(
                title: translate("messages"),
            )),
        body: Padding(
          padding: EdgeInsets.symmetric(vertical: 10.h),
          child: ListView.builder(
              shrinkWrap: true,
              padding: EdgeInsets.zero,
              itemCount: _chats?.length ?? 0,
              itemBuilder: (BuildContext context, int index) {
                return Column(children: [
                  InkWell(
                      onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      ChatRoom(threadId: _chats[index].id)))
                          .then((_) => _updateThreads(false)),
                      child: Container(
                          color: checkLastSeen(_chats[index])
                              ? Color(0xFFE1A854).withOpacity(0.3)
                              : Colors.transparent,
                          child: Padding(
                              padding: EdgeInsets.symmetric(
                                  vertical: 10.h, horizontal: 20.w),
                              child: Row(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.center,
                                  children: [
                                    Picture(
                                        height: 42.h,
                                        width: 42.w,
                                        photo: _chats[index].targetPicture),
                                    SizedBox(width: 10.w),
                                    Expanded(
                                      child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                children: [
                                                  Text(
                                                      _chats[index]
                                                          .targetName,
                                                      style: AppFonts.title9(
                                                          color:
                                                              Color.fromRGBO(
                                                                  0,
                                                                  0,
                                                                  0,
                                                                  0.7))),
                                                  Text(
                                                      LocaleStorageTimeService
                                                          .formatDateTimeMessages(
                                                              _chats[index]
                                                                  .messages
                                                                  .last
                                                                  .time),
                                                      style: AppFonts.text10(
                                                          color:
                                                              Color.fromRGBO(
                                                                  0,
                                                                  0,
                                                                  0,
                                                                  0.5)))
                                                ]),
                                            Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                children: [
                                                  SizedBox(
                                                      width: 180.w,
                                                      child: Text(
                                                          _chats[index]
                                                              .messages
                                                              .last
                                                              .msg,
                                                          maxLines: 1,
                                                          overflow:
                                                              TextOverflow
                                                                  .ellipsis,
                                                          style: AppFonts.text8(
                                                              color: Color
                                                                  .fromRGBO(
                                                                      0,
                                                                      0,
                                                                      0,
                                                                      0.5)))),
                                                  checkLastSeen(_chats[index])
                                                      ? Stack(
                                                          children: <Widget>[
                                                              Icon(
                                                                  Icons
                                                                      .notifications,
                                                                  size: 25.w),
                                                              Positioned(
                                                                  // draw a red marble
                                                                  top: 0.0,
                                                                  right: 0.0,
                                                                  child: Container(
                                                                      decoration: BoxDecoration(
                                                                          shape: BoxShape
                                                                              .circle,
                                                                          color: Colors
                                                                              .red),
                                                                      child: Padding(
                                                                          padding:
                                                                               EdgeInsets.all(3.w),
                                                                          child: Text(numberOfUnseenMessages(_chats[index]).toString(), style: AppFonts.text10(color: Colors.white)))))
                                                            ])
                                                      : Container()
                                                ])
                                          ]),
                                    )
                                  ])))),
                  Divider(height: 1, color: Colors.black12)
                ]);
              }),
        ));
  }
}
