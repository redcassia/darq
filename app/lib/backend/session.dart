import 'dart:async';

import 'package:flutter_translate/flutter_translate.dart';
import 'package:graphql/client.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Session {
  static final HttpLink _backendLink =
      HttpLink(uri: 'http://redcassia.com:3001/api');
  static GraphQLClient _client;
  static String _locale;

  static Future<void> setLocale(String locale) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('locale', locale);
    _locale = locale;

    var result = await (await getClient()).mutate(MutationOptions(
      documentNode: gql(r'''
            mutation($locale: Locale!) {
              setLocale(locale: $locale)
            }
          '''),
      variables: <String, dynamic>{'locale': locale},
    ));

    if (!result.hasException) {
      var token = result.data["setLocale"] as String;
      _client = GraphQLClient(
          cache: InMemoryCache(),
          link: AuthLink(getToken: () => "Bearer $token").concat(_backendLink));
      await prefs.setString("token", token);
    }
  }

  static Future<GraphQLClient> getClient() async {
    if (_client != null) {
      return _client;
    }

    var prefs = await SharedPreferences.getInstance();
    _locale = prefs.getString("locale");
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
            mutation($id: ID!, $locale: Locale) {
              authenticatePublicUser(id: $id, locale: $locale)
            }
          '''),
        variables: <String, dynamic>{
          'id': prefs.getString("id"),
          'locale': _locale,
        },
      ));

      if (!result.hasException) {
        token = await result.data["authenticatePublicUser"] as String;
        await prefs.setString("token", token);
      }
    }

    if (token == null) {
      var result =
          await GraphQLClient(cache: InMemoryCache(), link: _backendLink)
              .mutate(MutationOptions(
        documentNode: gql(r'''
            mutation($locale: Locale) {
              createPublicUser(locale: $locale)
            }
          '''),
        variables: <String, dynamic>{
          'locale': _locale,
        },
      ));

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

  static String formatInt(int val) {
    if (_locale == 'ar') return NumberFormat("", "ar_EG").format(val);
    return val.toString();
  }

  static String formatDateTime(String val) {
    return DateFormat(
            "dd / MM / y  \u2014  hh:mm a", _locale == "en" ? 'en_US' : 'ar_EG')
        .format(DateTime.parse(val).toLocal());
  }

  static String formatDate(String val) {
    return DateFormat("dd / MM / y", _locale == "en" ? 'en_US' : 'ar_EG')
        .format(DateTime.parse(val).toLocal());
  }

  static String formatTime(String val) {
    return DateFormat("hh:mm a", _locale == "en" ? 'en_US' : 'ar_EG')
        .format(DateTime.parse(val).toLocal());
  }

  static String formatDateTimeMessages(DateTime dateTime, {bool fullDate = false}) {
    DateTime now = DateTime.now();
    DateTime currentDate = DateTime(now.year, now.month, now.day);

    if (fullDate)
      return DateFormat("dd / MM / y  \u2014  hh:mm a",
              _locale == "en" ? 'en_US' : 'ar_EG')
          .format(dateTime.toLocal());
    if (currentDate.year > dateTime.year ||
        (currentDate.year == dateTime.year &&
            currentDate.day - 1 > dateTime.day))
      return DateFormat("dd / MM / y", _locale == "en" ? 'en_US' : 'ar_EG')
          .format(dateTime.toLocal());
    if (currentDate.year == dateTime.year &&
        currentDate.day - 1 == dateTime.day) return translate("yesterday");

    if (currentDate.year == dateTime.year && currentDate.day == dateTime.day)
      return DateFormat("hh:mm a", _locale == "en" ? 'en_US' : 'ar_EG')
          .format(dateTime.toLocal());
    return "";
  }
}
