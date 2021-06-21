import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/chat_list_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/community_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/explore_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/listing_page.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int currentTab = 0;
  final List<Widget> _children = [
    ExplorePage(),
    CommunityPage(enableBackButton: false),
    ListingPage(jsonFile: "events.json"),
    ChatListPage()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _children[currentTab],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentTab, // this will be set when a new tab is tapped
        onTap: (_) => onTabTapped(_),
        selectedItemColor: Color(AppColors.cyprus),
        unselectedItemColor: Color(AppColors.silverChalice),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            title: Text('Home'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.group_work_sharp),
            title: Text('Community'),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.event_available), title: Text('Events')),
          BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble), title: Text('Chats'))
        ],
      ),
    );
  }

  void onTabTapped(int index) {
    setState(() => currentTab = index);
  }
}
