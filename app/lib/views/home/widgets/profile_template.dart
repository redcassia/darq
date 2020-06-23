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

List<Widget> chatScreenWidgets = [];

class ProfileTemplate extends StatefulWidget {
  final String title;

  ProfileTemplate({this.title});
  @override
  _ProfileTemplateState createState() => _ProfileTemplateState();
}

class _ProfileTemplateState extends State<ProfileTemplate> {
  double rating = 0.0;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF86C2C2),
      body:
      Column(
        children: <Widget>[
          ProfileTemplateAppBar(widget: widget),
          Expanded(
            child: DefaultTile(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Header(
                      rating: rating,
                      widget: widget,
                      onRatingClicked: (_) {
                        setState(
                          () {
                            print("clicked");
                            print(_);
                            rating = _;
                          },
                        );
                      },
                    ),
                    SizedBox(height: 17.h),
                    CustomDivider(),
                    SizedBox(height: 17.h),
                    Text(
                      "Photos",
                      style: AppFonts.title9(
                        color: Color.fromRGBO(0, 0, 0, 0.67),
                      ),
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
                    )
                  ],
                ),
              ),
            ),
          )
        ],
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
