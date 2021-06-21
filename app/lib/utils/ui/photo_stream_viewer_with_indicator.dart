import 'package:darq/constants/app_color_palette.dart';
import 'package:darq/elements/app_fonts.dart';
import 'package:darq/models/explore_page_data.dart';
import 'package:darq/views/details_page.dart';
import 'package:darq/views/widgets/titled_img.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:carousel_slider/carousel_slider.dart';

class PhotoStreamViewerWithIndicator extends StatefulWidget {
  PhotoStreamViewerWithIndicator({this.stream, this.jsonFile});
  final Stream<List<BusinessHL>> stream;
  final String jsonFile;

  @override
  _PhotoStreamViewerWithIndicatorState createState() =>
      _PhotoStreamViewerWithIndicatorState();
}

class _PhotoStreamViewerWithIndicatorState
    extends State<PhotoStreamViewerWithIndicator> {
  ScrollController controller = ScrollController();
  List<BusinessHL> urlList = new List<BusinessHL>();

  int _current = 0;

  List<T> map<T>(List list, Function handler) {
    List<T> result = [];
    for (var i = 0; i < list.length; i++) {
      result.add(handler(i, list[i]));
    }

    return result;
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<BusinessHL>>(
        stream: widget.stream,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final business = snapshot.data;
            final children = business.map((business) => business).toList();
            return children.length != 0 ?
            Column(children: [
              carouseSliderBuilder(children),
              carouseSliderIndicators(children)
            ]) : Center(child: Text("E M P T Y", style: AppFonts.title9(color: Color(AppColors.cyprus))));
          }
          return Center(child: CircularProgressIndicator());
        });
  }

  SizedBox carouseSliderIndicators(List<BusinessHL> children) {
    return SizedBox(
        height: 30.h,
        width: 50.54.w,
        child: Center(
            child: ListView(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                controller: controller,
                scrollDirection: Axis.horizontal,
                children: map<Widget>(children, (index, url) {
                  if (controller.hasClients && _current == 0) {
                    controller.animateTo(0.w,
                        duration: Duration(seconds: 1), curve: Curves.ease);
                  }
                  if (controller.hasClients && _current > 4) {
                    controller.animateTo(11.09.w * (_current - 4),
                        duration: Duration(seconds: 1), curve: Curves.ease);
                  }
                  return Container(
                      width: 8.0.w,
                      height: 8.0.h,
                      margin: EdgeInsets.symmetric(
                          vertical: 10.0.h, horizontal: 2.0.w),
                      decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _current == index
                              ? Color.fromRGBO(0, 0, 0, 0.9)
                              : Color.fromRGBO(0, 0, 0, 0.4)));
                }))));
  }

  CarouselSlider carouseSliderBuilder(List<BusinessHL> children) {
    return CarouselSlider.builder(
        options: CarouselOptions(
            autoPlay: false,
            enlargeCenterPage: true,
            enableInfiniteScroll: false,
            onPageChanged: (i, _) => setState(() => _current = i)),
        itemCount: children.length,
        itemBuilder: (BuildContext context, i, j) {
          return InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) {
                  return DetailsPage(
                      jsonFile: widget.jsonFile, id: children[i].id);
                }));
              },
              child: TitledImage(
                  title: children[i].displayName,
                  subtitle: children[i].start,
                  displayPicture: children[i].displayPicture,
                  height: 169.h,
                  width: 317.w,
                  titleStyle: AppFonts.title6(color: Color(AppColors.white)),
                  subTitleStyle: AppFonts.title8(color: Color(AppColors.white),fontWeight: FontWeight.w400),
                  alignment: MainAxisAlignment.start));
        });
  }
}

