import 'dart:ui';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/res/path_files.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:darq/views/shared/custom_tile/default_tile.dart';
import 'package:darq/views/home/widgets/profile_template_header.dart';
import 'package:darq/views/home/widgets/profile_template_app_bar.dart';
import 'package:darq/views/home/widgets/custom_divider.dart';
import 'package:photo_view/photo_view.dart';
import 'dart:convert';
import 'package:darq/views/shared/image_container.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:darq/views/shared/star_rating.dart';
import 'package:darq/views/home/widgets/icon_leading_row.dart';

List<Widget> chatScreenWidgets = [];

class ProfileEx extends StatefulWidget {
  final String jsonFile;

  ProfileEx({this.jsonFile});
  @override
  _ProfileExState createState() => _ProfileExState();
}

class _ProfileExState extends State<ProfileEx> {
  double rating = 0.0;
  List<dynamic> col1 = [];
  List<dynamic> col2 = [];
  List<dynamic> col3 = [];

  parseColumn1(data) {
    for (int i = 0; i < col1.length; i++) {
      setState(() {
        switch (data[i]) {
          case 'picture':
            col1[i] = Picture(height: 80.w, width: 80.w, img: "avatar.png");
            break;
          case 'rating':
            col1[i] = SmoothStarRating(
                allowHalfRating: true,
                onRatingChanged: (v) => rating = v,
                size: 14.w,
                filledIconData: Icons.star,
                halfFilledIconData: Icons.star_half,
                defaultIconData: Icons.star_border,
                starCount: 5,
                rating: rating,
                borderColor: Color(0xFFE1A854),
                color: Color(0xFFE1A854),
                spacing: 0.0);
            break;
        }
      });
    }
    print("c1:");
    print(col1);
  }

  parseColumn2(c2) {
    for (int j = 0; j < col2.length; j++) {
      setState(() {
        switch (c2[j]) {
          case 'title':
            col2[j] = Text("Job Title Name",
                style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.7)));
            break;

          case 'subtitle':
            col2[j] = Text("Job subtitle",
                style:
                    AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));
            break;

          case 'gender':
            col2[j] = Text("Male",
                style:
                    AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));
            break;

          case 'nationality':
            col2[j] = Text("Syrian",
                style:
                    AppFonts.title10Odd(color: Color.fromRGBO(0, 0, 0, 0.5)));
            break;

          case 'address':
            col2[j] = IconLeadingRow(
                imgName: "address.png", txt: "xxx, xxxx St. United States");
            break;

          case 'time':
            col2[j] =
                IconLeadingRow(imgName: "clock.png", txt: "7:00 am - 10:pm");
            break;

          case 'number':
            col2[j] = IconLeadingRow(
                imgName: "telephone.png",
                txt: "Show Number",
                textStyle:
                    AppFonts.title10OddUnderlined(color: Color(0xFF426676)));
            break;
        }
      });
    }
  }

  parseColumn3(data) {
    for (int i = 0; i < col3.length; i++) {
      setState(() {
        switch (data[i]) {
          case 'description':
            col3[i] = Column(
              children: <Widget>[
                SizedBox(height: 9.h),
                Text(
                    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                    style: AppFonts.text6w500(
                        color: Color.fromRGBO(0, 0, 0, 0.69))),
                SizedBox(height: 17.h),
                CustomDivider(),
                SizedBox(height: 17.h),
              ],
            );
            break;
          case 'skills':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Skills",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("hhhhhh")
              ],
            );
            break;
          case 'exp':
            col3[i] = Column(
              children: <Widget>[
                Text(
                  "World Gym",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("hhhhhh")
              ],
            );
            break;
          case 'salary':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Skills",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("/hr")
              ],
            );
            break;
          case 'founded':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Founded",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("2012")
              ],
            );
            break;
          case 'Curriculum':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Canadian, British",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("2012")
              ],
            );
            break;
          case 'Curriculum':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Canadian, British",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("2012")
              ],
            );
            break;
          case 'start':
            col3[i] = Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Text(
                      "Start",
                      style:
                          AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                    ),
                    Text("9 May 2020")
                  ],
                ),
                Row(
                  children: <Widget>[
                    Text(
                      "End",
                      style:
                          AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                    ),
                    Text("12 May 2020")
                  ],
                ),
              ],
            );
            break;
          case 'reservation':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Tickets Reservations",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("Official website")
              ],
            );
            break;
          case 'price':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "30",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text(" \$"),
              ],
            );
            break;
          case 'org':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Organizer",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("nakhjmykt")
              ],
            );
            break;
          case 'profile':
            col3[i] = Text("A profile should be shown here");
            break;

          case 'home_service':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Home Service",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("Available")
              ],
            );
            break;
          case 'services':
            col3[i] = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Services:",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("- Skin Care"),
                Text("- Hair"),
                Text("- Nails"),
              ],
            );
            break;
          case 'website':
            col3[i] = Row(
              children: <Widget>[
                Text(
                  "Website",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("www.google.com")
              ],
            );
            break;
          case 'products':
            col3[i] = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Products:",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("- Honey"),
                Text("- Fresh Milk"),
                Text("- Honey"),
              ],
            );
            break;
          case 'classes':
            col3[i] = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Classes:",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                Text("- Fitness"),
                Text("- Fitness"),
                Text("- Fitness"),
              ],
            );
            break;
          case 'menu':
            col3[i] = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Menu:",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                InkWell(
                  child: Image(
                    image: AssetImage(PathFiles.ImgPath + "gallery.png"),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const DoubleTapWrapper(
                          imageProvider:
                              AssetImage("assets/images/gallery.png"),
                        ),
                      ),
                    );
                  },
                ),
              ],
            );
            break;
          case 'photos':
            col3[i] = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "Photos:",
                  style: AppFonts.title9(color: Color.fromRGBO(0, 0, 0, 0.67)),
                ),
                InkWell(
                  child: Image(
                    image: AssetImage(PathFiles.ImgPath + "gallery.png"),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const DoubleTapWrapper(
                          imageProvider:
                              AssetImage("assets/images/gallery.png"),
                        ),
                      ),
                    );
                  },
                ),
              ],
            );
            break;
        }
      });
    }
  }

  Future<String> loadJsonData() async {
    var jsonText =
        await rootBundle.loadString("assets/json_files/" + widget.jsonFile);

    setState(() {
      Map<String, dynamic> map = json.decode(jsonText);

      col1 = map["col1"];
      col2 = map["col2"];
      col3 = map["col3"];
      parseColumn1(col1);
      parseColumn2(col2);
      parseColumn3(col3);
    });

    return "Success";
  }

  @override
  void initState() {
    this.loadJsonData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF86C2C2),
      body: DefaultTile(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Flexible(
              flex: 1,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  Flexible(
                    flex: 1,
                    child: ListView.builder(
                        physics: new NeverScrollableScrollPhysics(),
                        padding: EdgeInsets.zero,
                        itemCount: col1.length,
                        itemBuilder: (BuildContext context, int index) {
                          return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[col1[index]]);
                        }),
                  ),
                  Flexible(
                    flex: 2,
                    child: ListView.builder(
                        physics: new NeverScrollableScrollPhysics(),
                        padding: EdgeInsets.zero,
                        itemCount: col2.length,
                        itemBuilder: (BuildContext context, int index) {
                          return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[col2[index]]);
                        }),
                  ),
                ],
              ),
            ),
            Flexible(
              flex: 5,
              child: ListView.builder(
                  physics: new NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  padding: EdgeInsets.zero,
                  itemCount: col3.length,
                  itemBuilder: (BuildContext context, int index) {
                    return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[col3[index]]);
                  }),
            ),
          ],
        ),
      ),
    );
  }
}

class DoubleTapWrapper extends StatelessWidget {
  const DoubleTapWrapper({
    this.imageProvider,
  });

  final ImageProvider imageProvider;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        constraints: BoxConstraints.expand(
          height: MediaQuery.of(context).size.height,
        ),
        child: PhotoView(
          imageProvider: imageProvider,
          enableRotation: true,
          filterQuality: FilterQuality.high,
        ),
      ),
    );
  }
}
