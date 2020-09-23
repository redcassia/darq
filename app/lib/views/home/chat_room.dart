import 'dart:async';

import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:darq/utilities/constants.dart';
import 'package:darq/utilities/screen_info.dart';
import 'package:darq/views/shared/app_bars/default_appbar.dart';
import 'package:darq/views/shared/capsule/right_rounded_capsule.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class Message {
  String sender;
  String time;
  String text;

  /// just to check isMe .. will be removed when use API
  bool isMe;

  Message({this.sender, this.time, this.text, this.isMe});
}

List<Message> messages = [
  Message(
      isMe: true,
      sender: "anonymous",
      time: "5:00 PM",
      text:
          "hey, dude!!! I want to reserve a table for 5 people... what should I do?? thanks..."),
  Message(
      isMe: false,
      sender: "Business Name",
      time: "5:20 PM",
      text:
          "hey...!! for reservation please have a direct phone call with the restaurant... thanks, we hope to hear from you soon..."),
  Message(
      isMe: true,
      sender: "anonymous",
      time: "5:30 PM",
      text:
          " what am I doing now!!! this is hilarious and weird!! If I should call the restaurant what is the purpose of this chatting feature!!! i am not going to call anyone and this is the last time to deal with this restaurant and this app at all!!"),
  Message(
      isMe: true,
      sender: "anonymous",
      time: "5:30 PM",
      text: "S H A M E   O N   Y O U   G U Y S   !!!!"),
  Message(
      isMe: false,
      sender: "Business Name",
      time: "5:40 PM",
      text: "thanks!!!! you are banned..."),
  Message(
      isMe: false,
      sender: "Business Name",
      time: "5:40 PM",
      text: "you ain't welcome here at all!!"),
  Message(
      isMe: true,
      sender: "anonymous",
      time: "5:30 PM",
      text: "I don't care   !!!!"),
];

class Chat extends StatefulWidget {
  @override
  _ChatState createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  final textFieldController = TextEditingController();
  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
  }

  Widget _chatBubble(Message msg) {
    return Column(children: [
      Container(
          alignment: msg.isMe ? Alignment.topRight : Alignment.topLeft,
          child: Container(
              constraints: BoxConstraints(maxWidth: SI.screenWidth * 0.80),
              padding: EdgeInsets.all(10.w),
              margin: EdgeInsets.symmetric(vertical: 8.h),
              decoration: BoxDecoration(
                  color: msg.isMe ? Color(0xFF86C2C2) : Colors.white,
                  borderRadius: BorderRadius.circular(15)),
              child: Text(msg.text,
                  style: AppFonts.text7(
                      color: msg.isMe ? Colors.white : Colors.black87)))),
      msg.isMe
          ? Row(mainAxisAlignment: MainAxisAlignment.end, children: [
              Text(msg.time, style: AppFonts.text8(color: Colors.black45)),
              SizedBox(width: 5.w),
              Text(
                msg.sender,
                style: AppFonts.text8(color: Colors.black45),
              )
            ])
          : Row(children: [
              Text(msg.sender, style: AppFonts.text8(color: Colors.black45)),
              SizedBox(width: 5.w),
              Text(msg.time, style: AppFonts.text8(color: Colors.black45))
            ])
    ]);
  }

  scrollDownListView() {
    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
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
                  onTap: () => setState(() => scrollDownListView()),
                  controller: textFieldController,
                  cursorColor: Color(0xFF86C2C2),
                  decoration:
                      InputDecoration(hintText: "Send a message",contentPadding:  EdgeInsets.symmetric(vertical: 5.h),isCollapsed: true, border: InputBorder.none,))),
          IconButton(
              icon: Icon(Icons.send),
              color: Color(0xFF86C2C2),
              onPressed: () {
                setState(() {
                  textFieldController.text.isNotEmpty ?
                  messages.add(Message(
                      text: textFieldController.text,
                      time: "5:20 PM",
                      sender: "anonymous",
                      isMe: true)) : {};
                  textFieldController.clear();
                  scrollDownListView();
                });
              })
        ]));
  }

  @override
  Widget build(BuildContext context) {
    Future.delayed(Duration.zero, scrollDownListView);
    _keyboardIsVisible() ? scrollDownListView() : {};
    return Scaffold(
        backgroundColor: Color(0xFFE5E5E5),
        appBar: PreferredSize(
            preferredSize: Size.fromHeight(ConsDimensions.LargeAppBarHeight.h),
            child: DefaultAppBar(
                allowHorizontalPadding: false,
                title: "Business Name",
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
                  itemCount: messages.length,
                  itemBuilder: (BuildContext context, int i) {
                    final Message msg = messages[i];

                    /// check if sender is current user id
                    return _chatBubble(msg);
                  })),
          _sendMessageArea()
        ]));
  }
}
