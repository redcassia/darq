import 'package:graphql/client.dart';

class APIPath{
  static final HttpLink httpAPIPath = HttpLink(uri: 'http://redcassia.com:3001/api');
  static const httpAttachmentPath = "http://redcassia.com:3001/attachment/";
}