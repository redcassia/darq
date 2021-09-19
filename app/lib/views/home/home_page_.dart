import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/utils/managers/explore_page_data_stream.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/community_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/explore_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/listing_page.dart';
import 'package:darq/views/home/bottom_navigation_bar_pages/chat_list.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/global.dart';
import 'package:graphql/client.dart';
import 'package:provider/provider.dart';

class HomePage extends StatefulWidget {
  GraphQLClient client;

  HomePage({this.client});
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int currentTab = 0;
  List<Widget> _children;

  @override
  Widget build(BuildContext context) {
    _children = [

      Provider<ExplorePageData>(
        create: (_) => GraphQLExpPageData(client: widget.client),
        child: ExplorePage(),),
      CommunityPage(enableBackButton: false),
      ListingPage(jsonFile: "events.json"),
      ChatList()
    ];
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
            title: Text(translate('home')),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.group_work_sharp),
            title: Text(translate('community')),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.event_available), title: Text(translate('events'))),
          BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble), title: Text(translate('messages')))
        ],
      ),
    );
  }

  void onTabTapped(int index) {
    setState(() => currentTab = index);
  }
}
