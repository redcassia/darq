import 'package:flutter/cupertino.dart';

class BusinessHL {
  BusinessHL({
    @required this.id,
    @required this.displayName,
    @required this.displayPicture,
    this.subType,
    this.start,
  });

  final String id;
  final String displayName;
  final String displayPicture;
  final String subType;
  final String start;
}
