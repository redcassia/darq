import 'package:darq/utils/managers/auth_state_provider.dart';
import 'package:darq/utils/services/auth/registration_service.dart';
import 'package:darq/utils/services/local_storage_auth_service.dart';
import 'package:graphql/client.dart';

class GraphQLLocalization {
  static Future<void> setGraphQLLocale(
      String locale, AuthStateProvider authState) async {
    await LocaleStorageAuthService.setLocale(locale);

    GraphQLClient client = authState.getClient;

    if (client != null)
      client
          .mutate(MutationOptions(
        documentNode: gql(r'''
            mutation($locale: Locale!) {
              setLocale(locale: $locale)
            }
          '''),
        variables: <String, dynamic>{'locale': locale},
      ))
          .then((result) {
        if (result.hasException) throw Exception("Failed to set Locale");
      });
    else
      await Registration.registerUser(locale: locale, authState: authState);
  }
}
