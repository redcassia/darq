import 'dart:async';
import 'package:darq/constants/api_path.dart';
import 'package:graphql/client.dart';
import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/utils/services/local_storage_auth_service.dart';

class Registration {
  static Future<void> registerUser(
      {String locale, AuthStateProvider authState}) async {
    QueryResult result =
    await GraphQLClient(cache: InMemoryCache(), link: APIPath.httpAPIPath)
        .mutate(MutationOptions(
      documentNode: gql(r'''
            mutation($locale: Locale) {
              createPublicUser(locale: $locale)
            }
          '''),
      variables: <String, dynamic>{
        'locale': locale,
      },
    ));

    if (result.hasException) {
      throw Exception("can't create new user");
    }

    final token = await result.data["createPublicUser"] as String;
    await LocaleStorageAuthService.setToken(token);
    authState.setClient = GraphQLClient(
        cache: InMemoryCache(),
        link: AuthLink(getToken: () => "Bearer $token")
            .concat(APIPath.httpAPIPath));

    result = await authState.getClient.query(QueryOptions(documentNode: gql('''
          query {
            user {
              id
            }
          }
        ''')));
    if (result.hasException) {
      throw Exception("can't get user id");
    }
    String id = await result.data["user"]["id"] as String;
    await LocaleStorageAuthService.setId(id);
  }
}