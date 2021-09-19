import 'package:darq/models/explore_page_data.dart';
import 'package:flutter/material.dart';
import 'package:graphql/client.dart';

abstract class ExplorePageData {
  Stream<List<BusinessHL>> childEducationCentersBusinessHLStream();
  Stream<List<BusinessHL>> cuisineBusinessHLStream();
  Stream<List<BusinessHL>> entertainmentBusinessHLStream();
  Stream<List<BusinessHL>> eventsBusinessHLStream();
  Stream<List<BusinessHL>> madeInQatarBusinessHLStream();
}

class GraphQLExpPageData implements ExplorePageData {

  final GraphQLClient client;

  GraphQLExpPageData({this.client});

  Stream<QueryResult> getSnapShots(String query) {
    return client
        .query(QueryOptions(
          documentNode: gql(query),
        ))
        .asStream();
  }

  Stream<List<BusinessHL>> fromMap(Stream<QueryResult> snapShots) {
    return snapShots.map((snapshot) {
      return snapshot.data['items']
          .map((snapshot) {
            final data = snapshot;
            return data != null
                ? BusinessHL(
                    displayName: data['display_name'],
                    displayPicture: data['display_picture'],
                    subType: data['sub_type_string'],
                    id: data['id'],
                    start: "")
                : null;
          })
          .toList()
          .cast<BusinessHL>();
    });
  }

  Stream<List<BusinessHL>> fromMapEvent(Stream<QueryResult> snapShots) {
    return snapShots.map((snapshot) {
      return snapshot.data['items']
          .map((snapshot) {
            final data = snapshot;
            return data != null
                ? BusinessHL(
                    displayName: data['display_name'],
                    displayPicture: data['display_picture'],
                    id: data['id'],
                    subType: "",
                    start: data['duration']['start'])
                : null;
          })
          .toList()
          .cast<BusinessHL>();
    });
  }

  //ChildEducationBusiness
  @override
  Stream<List<BusinessHL>> childEducationCentersBusinessHLStream() {
    final snapShots = getSnapShots(
        "query { items: businesses(type: ChildEducationBusiness) { id, display_name, display_picture ... on ChildEducationBusiness { sub_type_string } }  }");
    return fromMap(snapShots);
  }

  //FoodBusiness
  @override
  Stream<List<BusinessHL>> cuisineBusinessHLStream() {
    final snapShots = getSnapShots(
        "query { items: businesses(type: FoodBusiness) { id, display_name, display_picture ... on FoodBusiness { sub_type_string } }  }");
    return fromMap(snapShots);
  }

  //EntertainmentBusiness
  @override
  Stream<List<BusinessHL>> entertainmentBusinessHLStream() {
    final snapShots = getSnapShots(
        "query { items: businesses(type: EntertainmentBusiness) { id, display_name, display_picture ... on EntertainmentBusiness { sub_type_string } }  }");
    return fromMap(snapShots);
  }

  //events
  @override
  Stream<List<BusinessHL>> eventsBusinessHLStream() {
    final snapShots = getSnapShots(
        "query { items: events { id, display_name, display_picture, type  duration{ start }   }  }");
    return fromMapEvent(snapShots);
  }

  //made in qatar
  @override
  Stream<List<BusinessHL>> madeInQatarBusinessHLStream() {
    final snapShots = getSnapShots(
        "query { items: businesses(type: MadeInQatarBusiness) { id, display_name, display_picture ... on MadeInQatarBusiness { sub_type_string } }  }");
    return fromMap(snapShots);
  }
}
