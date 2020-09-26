class DynamicLoader {

  static _init() {
    if (! this._initialized) {
      this._initialized = true;
      this.singleLoadScripts = new Object();
      this.loadedScripts = new Object();
      this.unloadCallbacks = new Map();
    }
  }

  static loadScript(group, src, onload, singleLoad = false) {
    this._init();

    if (! this.loadedScripts[group]) {
      this.loadedScripts[group] = {
        src: [],
        doms: []
      }
    }

    if (this.singleLoadScripts[src]) {
      if (onload) onload();
      return;
    }

    if (this.loadedScripts[group].src.indexOf(src) == -1) {

      var s = document.createElement('script');

      if (singleLoad) {
        this.singleLoadScripts[src] = s;
      }
      else {
        this.loadedScripts[group].src.push(src);
        this.loadedScripts[group].doms.push(s);
      }

      if (onload) s.onload = onload;
      s.setAttribute('src', src);
      document.body.appendChild(s);
    }
  }

  static unloadScripts(group) {
    this._init();

    if (this.loadedScripts[group]) {
      if (this.loadedScripts[group].unloadCallbacks) {
        this.loadedScripts[group].unloadCallbacks.forEach(c => c());
      }
      this.loadedScripts[group].doms.forEach(s => s.remove());
      delete this.loadedScripts[group];
    }
  }

  static loadTo(tagId, target, script = "", preloadScripts = [], onload) {
    this._init();

    if (preloadScripts.length > 0) {
      var preload = preloadScripts.pop();
      this.loadScript(
        tagId,
        preload.src,
        () => {
          this.loadTo(tagId, target, script, preloadScripts, onload);
        },
        preload.singleLoad || false
      );
    }
    else {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', target, true);
      xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;
        document.getElementById(tagId).innerHTML = this.responseText;
        setGlobalEventHandlers();

        if (script && script.length > 0) {
          DynamicLoader.loadScript(tagId, script, onload);
        }
      };
      xhr.send();
    }
  }

  static beforeUnload(tagId, callback) {
    this._init();

    if (this.loadedScripts[tagId]) {
      if (! this.loadedScripts[tagId].unloadCallbacks) {
        this.loadedScripts[tagId].unloadCallbacks = []
      }
      this.loadedScripts[tagId].unloadCallbacks.push(callback);
    }
  }

  static unloadFrom(tagId) {
    this._init();

    this.unloadScripts(tagId);
    document.getElementById(tagId).innerHTML = '';
  }
}
