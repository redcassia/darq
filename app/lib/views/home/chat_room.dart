import 'dart:async';
import 'package:intl/intl.dart';

import 'package:darq/backend.dart';
import 'package:darq/chat.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graphql/client.dart';

class ChatRoom extends StatefulWidget {
  final String threadId;
  final String businessId;

  ChatRoom({this.threadId, this.businessId});

  @override
  _ChatRoomState createState() => _ChatRoomState();
}

class _ChatRoomState extends State<ChatRoom> {
  final textFieldController = TextEditingController();
  ScrollController _scrollController = ScrollController();

  MessageThread _thread;
  Chat _chatInstance;
  bool _scrollToEnd = true;
  int _oldMessageCount;

  @override
  void initState() {
    super.initState();

    _chatInstance = new Chat();
    _chatInstance
        .getThread(threadId: widget.threadId, businessId: widget.businessId)
        .then((thread) => setState(() {
              _thread = thread;
            }));

    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.minScrollExtent) {
        _oldMessageCount = _thread.messages.length;
        _chatInstance.loadMore(_thread.id).then((_) => setState(() {
              _thread = _;
            }));
      } else if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _scrollToEnd = false;
      }
    });
  }

  String formatDate(DateTime val) {
    return DateFormat("dd / MM / y  \u2014  hh:mm a", "en_US")
        .format(val.toLocal())
        .toString();
  }

  _sendMsg(String msg) {
    if (msg == null || msg.trim().length == 0) return;
    _chatInstance
        .sendMessage(msg,
            threadId: widget.threadId, businessId: widget.businessId)
        .then((_) => setState(() {
              _thread = _;
              _scrollToEnd = true;
            }));
  }

  Widget _chatBubble(Message msg) {
    return Container(
        height: 68.h,
        child: Column(children: [
          Container(
              alignment: msg.sender == "PUBLIC"
                  ? Alignment.topRight
                  : Alignment.topLeft,
              child: Container(
                  constraints: BoxConstraints(maxWidth: SI.screenWidth * 0.80),
                  padding: EdgeInsets.all(10.w),
                  margin: EdgeInsets.symmetric(vertical: 8.h),
                  decoration: BoxDecoration(
                      color: msg.sender == "PUBLIC"
                          ? Color(0xFF86C2C2)
                          : Colors.white,
                      borderRadius: BorderRadius.circular(15)),
                  child: Text(msg.msg,
                      style: AppFonts.text7(
                          color: msg.sender == "PUBLIC"
                              ? Colors.white
                              : Colors.black87)))),
          msg.sender == "PUBLIC"
              ? Align(
                  alignment: Alignment.centerRight,
                  child: Text(formatDate(msg.time),
                      style: AppFonts.text8(color: Colors.black45)))
              : Align(
                  alignment: Alignment.centerLeft,
                  child: Text(formatDate(msg.time),
                      style: AppFonts.text8(color: Colors.black45)))
        ]));
  }

  void _setScrollPosition() {
    if (_scrollToEnd) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    } else if (_oldMessageCount != null) {
      _scrollController
          .jumpTo(68.h * (_thread.messages.length - _oldMessageCount));
    }
    _oldMessageCount = null;
  }

  bool _keyboardIsVisible() {
    return !(MediaQuery.of(context).viewInsets.bottom == 0.0);
  }

  Widget _sendMessageArea() {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 8.w),
        color: Colors.white,
        child: Row(children: [
          Expanded(
              child: TextField(
                  keyboardType: TextInputType.multiline,
                  maxLines: 20,
                  minLines: 1,
                  onTap: () {
                    _scrollToEnd = true;
                    _setScrollPosition();
                  },
                  controller: textFieldController,
                  cursorColor: Color(0xFF86C2C2),
                  decoration: InputDecoration(
                    hintText: "Send a message",
                    contentPadding: EdgeInsets.symmetric(vertical: 5.h),
                    isCollapsed: true,
                    border: InputBorder.none,
                  ))),
          IconButton(
              icon: Icon(Icons.send),
              color: Color(0xFF86C2C2),
              onPressed: () {
                _sendMsg(textFieldController.text);
                textFieldController.clear();
              })
        ]));
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _setScrollPosition();
    });
    if (_keyboardIsVisible()) _scrollToEnd = true;

    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: _thread?.targetName ?? "",
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
        body: Column(children: [
          Expanded(
              child: ListView.builder(
                  controller: _scrollController,
                  padding:
                      EdgeInsets.only(left: 20.w, right: 20.w, bottom: 11.h),
                  itemCount: _thread?.messages?.length ?? 0,
                  itemBuilder: (BuildContext context, int i) {
                    /// check if sender is current user id
                    return _chatBubble(_thread.messages[i]);
                  })),
          _sendMessageArea()
        ]));
  }
}
