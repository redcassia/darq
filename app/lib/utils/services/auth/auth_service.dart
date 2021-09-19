// import 'dart:async';
// import 'package:darq/constants/api_path.dart';
// import 'package:graphql/client.dart';
// import 'package:darq/utils/services/local_storage_auth_service.dart';
//
// class Authentication {
//   static Future<String> authenticateUser() async {
//     QueryResult result =
//     await GraphQLClient(cache: InMemoryCache(), link: APIPath.httpAPIPath)
//         .mutate(MutationOptions(
//       documentNode: gql(r'''
//             mutation($id: ID!, $locale: Locale) {
//               authenticatePublicUser(id: $id, locale: $locale)
//             }
//           '''),
//       variables: <String, dynamic>{
//         'id': await LocaleStorageAuthService.getId,
//         'locale': await LocaleStorageAuthService.getLocale,
//       },
//     ));
//     if (!result.hasException) {
//       final token = await result.data["authenticatePublicUser"] as String;
//       await LocaleStorageAuthService.setToken(token);
//       return token;
//     }
//     return null;
//   }
// }
