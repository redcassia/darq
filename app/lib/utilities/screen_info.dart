class SI {
  static double screenHeight;
  static double screenWidth;

  static Function _widthRatio;
  static Function _heightRatio;

  static setScreenDimensions(double width, double height) {
    screenHeight = height;
    screenWidth = width;
  }

  static double wp(double w) => _widthRatio(w);
  static double hp(double h) => _heightRatio(h);
}
