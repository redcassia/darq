import 'package:darq/constants/api_path.dart';
import 'package:darq/utils/services/auth/auth_service.dart';
import 'package:flutter/cupertino.dart';
import 'package:graphql/client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:darq/utils/services/local_storage_auth_service.dart';

class AuthStateProvider extends ChangeNotifier {
  GraphQLClient _client = null;

  GraphQLClient get getClient => _client;

  set setClient(GraphQLClient client) {
    _client = client;
    notifyListeners();
  }

  Future<void> authState() async {
    String token = await LocaleStorageAuthService.getToken;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // try id
    if (token == null && prefs.containsKey("id"))
      token = await Authentication.authenticateUser();

    if (token != null && getClient == null) {
      setClient = GraphQLClient(
          cache: InMemoryCache(),
          link: AuthLink(getToken: () => "Bearer $token")
              .concat(APIPath.httpAPIPath));
    }
  }
}
