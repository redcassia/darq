class DynamicLoader {
  static singleLoadScripts = {};
  static loadedScripts = {};

  static loadScript(group, src, onload, singleLoad = false) {
    if (! this.loadedScripts[group]) {
      this.loadedScripts[group] = {
        src: [],
        doms: []
      }
    }

    if (this.singleLoadScripts[src]) {
      onload();
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

      s.onload = onload;
      s.setAttribute('src', src);
      document.body.appendChild(s);
    }
  }

  static unloadScripts(group) {
    if (this.loadedScripts[group]) {
      this.loadedScripts[group].doms.forEach(s => s.remove());
      delete this.loadedScripts[group];
    }
  }

  static loadTo(tagId, target, script = "", preloadScripts = []) {

    if (preloadScripts.length > 0) {
      var preload = preloadScripts.pop();
      this.loadScript(
        tagId,
        preload.src,
        () => {
          this.loadTo(tagId, target, script, preloadScripts);
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
          DynamicLoader.loadScript(tagId, script)
        }
      };
      xhr.send();
    }
  }

  static unloadFrom(tagId) {
    document.getElementById(tagId).innerHTML = '';
    this.unloadScripts(tagId);
  }
}

function openInNewTab(url) {
  console.log(`Opening ${url}`);
  var win = window.open(url, '_blank');
  win.focus();
}
