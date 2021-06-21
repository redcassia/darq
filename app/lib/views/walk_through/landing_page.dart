import 'package:darq/utils/managers/auth_state_provider.dart';

import 'package:darq/utils/managers/explore_page_data_stream.dart';
import 'package:darq/utils/helpers/screen_dimensions_helper.dart';
import 'package:darq/views/home/home_page_.dart';
import 'package:darq/views/walk_through/welcome_page.dart';
import 'package:flutter/material.dart';
import 'package:graphql/client.dart';
import 'package:provider/provider.dart';

class LandingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    ScreenDimensionsHelper.setScreenHeight =  MediaQuery.of(context).size.height;
    ScreenDimensionsHelper.setScreenWidth =  MediaQuery.of(context).size.width;
    final auth =
        Provider.of<AuthStateProvider>(context, listen: true);
    return FutureBuilder(
        future: auth.authState(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            final GraphQLClient user = auth.getClient;
            if (user == null)
              return WelcomePage();
            else
              return Provider<ExplorePageData>(
                  create: (_) => GraphQLExpPageData(client: user),
                  child: HomePage());
          }
          return Scaffold(body: Center(child: CircularProgressIndicator()));
        });
  }
}
