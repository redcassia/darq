class SI {
  static double screenHeight;
  static double screenWidth;

  static setScreenHeight(double height) {
    screenHeight = height;
  }

  static setScreenWidth(double width) {
    screenWidth = width;
  }

  static Function _widthRatio;
  static Function _heightRatio;

  static double wp(double w) => _widthRatio(w);
  static double hp(double h) => _heightRatio(h);
}
