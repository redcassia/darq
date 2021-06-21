import 'package:flutter/cupertino.dart';

class FlipProvider extends ChangeNotifier {
  bool _flipToSelectLanguagePage = false;

  bool get getFlipToToSelectLanguagePage => _flipToSelectLanguagePage;

  set setFlipToToSelectLanguagePage(bool flipToSelectLanguagePage) {
    _flipToSelectLanguagePage = true;
    notifyListeners();
  }
}

class SelectLangWidgetsProvider extends ChangeNotifier {
  bool _selectedLangIsEnglish = true;

  bool _loadingIndicator = false;

  bool get getSelectedLangIsEnglish => _selectedLangIsEnglish;

  bool get getLoadingIndicator => _loadingIndicator;

  set setSelectedLangIsEnglish(bool selectedLangIsEnglish) {
    _selectedLangIsEnglish = selectedLangIsEnglish;
    notifyListeners();
  }

  set setLoadingIndicator(bool flipToSelectLanguagePage) {
    _loadingIndicator = true;
    notifyListeners();
  }
}
