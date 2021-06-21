class ScreenDimensionsHelper {
  static double _screenHeight;
  static double _screenWidth;

  static set setScreenHeight(double height) => _screenHeight = height;
  static set setScreenWidth(double width) => _screenWidth = width;

  static get getScreenHeight => _screenHeight;
  static get getScreenWidth => _screenWidth;
}
