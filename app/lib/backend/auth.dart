import 'dart:async';

import 'package:graphql/client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Auth {
  static final HttpLink _backendLink =
      HttpLink(uri: 'http://redcassia.com:3001/api');
  static GraphQLClient _client;

  static Future<bool> checkClient() async {
    var prefs = await SharedPreferences.getInstance();

    if (_client != null ||
        prefs.containsKey("token") ||
        prefs.containsKey("id")) {
      return true;
    }
    return false;
  }

  static Future<GraphQLClient> getClient() async {
    if (_client != null) {
      return _client;
    }

    var prefs = await SharedPreferences.getInstance();

    String token;

    // try token
    if (prefs.containsKey("token")) {
      token = prefs.getString("token");

      var result = await GraphQLClient(
              cache: InMemoryCache(),
              link: AuthLink(getToken: () => "Bearer $token")
                  .concat(_backendLink))
          .query(QueryOptions(documentNode: gql(r'''
            query {
              user {
                id
              }
            }
          ''')));

      if (result.hasException) {
        token = null;
      }
    }

    // try id
    if (token == null && prefs.containsKey("id")) {
      var result =
          await GraphQLClient(cache: InMemoryCache(), link: _backendLink)
              .mutate(MutationOptions(
        documentNode: gql(r'''
            mutation($id: ID!) {
              authenticatePublicUser(id: $id)
            }
          '''),
        variables: <String, dynamic>{
          'id': prefs.getString("id"),
        },
      ));

      if (!result.hasException) {
        token = await result.data["authenticatePublicUser"] as String;

        await prefs.setString("token", token);
      }
    }

    // create new user id
    if (token == null) {
      var result =
          await GraphQLClient(cache: InMemoryCache(), link: _backendLink)
              .mutate(MutationOptions(documentNode: gql(r'''
            mutation {
              createPublicUser
            }
          ''')));

      if (result.hasException) {
        throw Exception("Unable to create new user");
      }

      token = result.data["createPublicUser"] as String;
      await prefs.setString("token", token);

      _client = GraphQLClient(
          cache: InMemoryCache(),
          link: AuthLink(getToken: () => "Bearer $token").concat(_backendLink));

      result = await _client.query(QueryOptions(documentNode: gql('''
          query {
            user {
              id
            }
          }
        ''')));

      if (result.hasException) {
        throw Exception("Failed to get user id");
      }

      await prefs.setString("id", result.data["user"]["id"] as String);
    }

    if (_client == null) {
      _client = GraphQLClient(
          cache: InMemoryCache(),
          link: AuthLink(getToken: () => "Bearer $token").concat(_backendLink));
    }

    return _client;
  }
}
