import 'package:darq/elements/app_fonts.dart';
import 'package:darq/models/explore_page_data.dart';
import 'package:darq/views/details_page.dart';
import 'package:darq/views/widgets/titled_img.dart';
import 'package:flutter/material.dart';
import 'package:darq/constants/app_color_palette.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PhotoStreamViewerWithNoIndicator extends StatelessWidget {
  const PhotoStreamViewerWithNoIndicator(
      {this.containerRadius,
      this.width,
      this.height,
      this.titleStyle,
      this.subTitleStyle,
      @required this.listTitle,
      @required this.jsonFile,
      @required this.stream,
      Key key})
      : super(key: key);

  final double containerRadius;
  final String listTitle;
  final String jsonFile;
  final double width;
  final double height;
  final TextStyle titleStyle;
  final TextStyle subTitleStyle;
  final Stream<List<BusinessHL>> stream;

  @override
  Widget build(BuildContext context) {
    return Flexible(
        fit: FlexFit.loose,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          SizedBox(height: 20.h),
          Text(listTitle,
              style: AppFonts.title6(color: Color(AppColors.cyprus))),
          SizedBox(height: 20.h),
          buildStreamBuilder()
        ]));
  }

  StreamBuilder<List<BusinessHL>> buildStreamBuilder() {
    return StreamBuilder<List<BusinessHL>>(
        stream: stream,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final business = snapshot.data;
            final children = business.map((business) {
              return InkWell(
                  onTap: () => Navigator.push(context,
                          MaterialPageRoute(builder: (context) {
                        return DetailsPage(jsonFile: jsonFile, id: business.id);
                      })),
                  child: TitledImage(
                    title: business.displayName,
                      subtitle: business.subType,
                      displayPicture: business.displayPicture,
                      alignment: MainAxisAlignment.end,
                      width: width,
                      containerRadius: containerRadius,
                      titleStyle: titleStyle,
                      subTitleStyle: subTitleStyle));
            }).toList();
            return Container(
              height: height ?? 134.h,
              child: ListView.separated(
                  separatorBuilder: (BuildContext context, int index) {
                    return SizedBox(width: 10.w);
                  },
                  itemCount: children.length,
                  scrollDirection: Axis.horizontal,
                  itemBuilder: (_, i) => children[i]),
            );
          }
          return Center(child: CircularProgressIndicator());
        });
  }
}


