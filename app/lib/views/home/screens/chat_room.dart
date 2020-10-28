import 'dart:async';

import 'package:darq/backend/chat.dart';
import 'package:darq/backend/session.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/shared/app_bars/back_arrow.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_translate/flutter_translate.dart';
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
  bool _refresh = true;
  String _businessName = "";
  bool _messageInFlight = false;
  @override
  void initState() {
    super.initState();

    _chatInstance = new Chat();
    _chatInstance
        .getThread(threadId: widget.threadId, businessId: widget.businessId)
        .then((thread) {
      setState(() {
        _thread = thread;
        _businessName = thread.targetName;
      });
      _doRefresh();
    }).catchError((e) async {
      var client = await Session.getClient();
      var result = await client.query(QueryOptions(
          documentNode: gql(
              r'''query($id: ID!) { business(id: $id) { display_name } }'''),
          variables: {"id": widget.businessId}));
      if (!result.hasException)
        setState(() {
          _businessName = result.data["business"]["display_name"];
        });
    });

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

  @override
  void dispose() {
    _refresh = false;
    super.dispose();
  }

  void _doRefresh() {
    if (_thread != null) {
      var lastIndex = _thread.messages.last.index;
      _chatInstance.refreshThread(_thread.id).then((_) {
        if (_refresh) {
          setState(() {
            _thread = _;
            if (_.messages.last.index > lastIndex) _scrollToEnd = true;
          });
          Future.delayed(Duration(seconds: 10), _doRefresh);
        }
      });
    } else {
      if (_refresh) Future.delayed(Duration(seconds: 10), _doRefresh);
    }
  }

  _sendMsg(String msg) {
    if (msg == null || msg.trim().length == 0) return;
    _messageInFlight = true;
    _chatInstance
        .sendMessage(msg,
            threadId: _thread?.id ?? null, businessId: widget.businessId)
        .then((_) => setState(() {
              _thread = _;
              _scrollToEnd = true;
              _messageInFlight = false;
            }));
  }

  _seeMsg() {
    if (_thread != null &&
        _thread.messages.last.index > _thread.senderLastSeenIndex) {
      _chatInstance.seeMessage(_thread.id).then((_) {
        setState(() {
          _thread = _;
        });
      });
    }
  }

  Widget _chatBubble(Message msg) {
    return Column(children: [
      Visibility(
          child: Container(
              padding: EdgeInsets.symmetric(vertical: 5.h, horizontal: 5.w),
              width: double.infinity,
              decoration: BoxDecoration(
                  color: Color(0xFFE1A854),
                  borderRadius: BorderRadius.circular(15)),
              child: Center(
                  child: Text(translate("new_messages"),
                      style: AppFonts.text7(color: Colors.black87)))),
          visible: msg.index - 1 == _thread.senderLastSeenIndex),
      Column(children: [
        Container(
            alignment:
                msg.sender == "PUBLIC" ? Alignment.topRight : Alignment.topLeft,
            child: Container(
                constraints: BoxConstraints(maxWidth: 280.w),
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
                child: Text(
                    Session.formatDateTimeMessages(msg.time, fullDate: true),
                    style: AppFonts.text8(color: Colors.black45)))
            : Align(
                alignment: Alignment.centerLeft,
                child: Text(
                    Session.formatDateTimeMessages(msg.time, fullDate: true),
                    style: AppFonts.text8(color: Colors.black45)))
      ])
    ]);
  }

  void _setScrollPosition() {
    if (_scrollToEnd) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    } else if (_oldMessageCount != null) {
      _scrollController.jumpTo(_scrollController.position.minScrollExtent);
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
                style: AppFonts.text7(color: Colors.black),
                  keyboardType: TextInputType.multiline,
                  maxLines: 20,
                  minLines: 1,
                  onTap: () {
                    _seeMsg();
                    _scrollToEnd = true;
                    _setScrollPosition();
                  },
                  controller: textFieldController,
                  cursorColor: Color(0xFF86C2C2),
                  decoration: InputDecoration(
                    hintText: translate("send_message"),
                    hintStyle: AppFonts.text7w500(color:  Colors.black38),
                    contentPadding: EdgeInsets.symmetric(vertical: 5.h),
                    isCollapsed: true,
                    border: InputBorder.none,
                  ))),
          RotatedBox(
              quarterTurns:
                  Localizations.localeOf(context).languageCode == 'en' ? 0 : 4,
              child: IconButton(
                  icon: Icon(Icons.send),
                  iconSize: 30.w,
                  color: Color(0xFF86C2C2),
                  onPressed: () {
                    if (!_messageInFlight) {
                      _sendMsg(textFieldController.text);
                      textFieldController.clear();
                    }
                  }))
        ]));
  }

  @override
  Widget build(BuildContext context) {
    if (!_refresh) {
      _refresh = true;
      _doRefresh();
    }
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
                title: _businessName,
                bgImage: "app_bar_rectangle.png",
                leading: BackArrow(),
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
