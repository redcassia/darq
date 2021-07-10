var cron = require('node-cron');

class ServerManager {

  static onBegin(f) {
    this._onBegin.push(f);
  }

  static async begin() {
    for (var i = 0; i < this._onBegin.length; ++i) {
      await this._onBegin[i]();
    }
  }

  static onEnd(f) {
    this._onEnd.push(f);
  }

  static async end() {
    for (var i = this._onEnd.length - 1; i >=0 ; --i) {
      await this._onEnd[i]();
    }
  }

  static _beginMaintenance() {
    this.inMaintenance = true;
  }

  static _endMaintenance() {
    this.inMaintenance = false;

    for (var i = 0; i < this.waitingRequests.length; ++i) {
      this.waitingRequests[i]();
    }

    this.waitingRequests = [];
  }

  static deferRequest(f) {
    this.waitingRequests.push(f);
  }

  static scheduleMaintenance(schedule, maintenanceFunc) {
    cron.schedule(schedule, async () => {
      console.info("Starting scheduled maintenance");

      try {
        this._beginMaintenance();
        await maintenanceFunc();
        this._endMaintenance();

        console.info("Scheduled maintenance completed");
      }
      catch (e) {
        console.error(e);
        console.error("Scheduled maintenance failed");
      }
    });
  }

  static async doMaintenanceNow(maintenanceFunc) {
    console.info("Starting maintenance");

    try {
      this._beginMaintenance();
      await maintenanceFunc();
      this._endMaintenance();
  
      console.info("Maintenance completed");
    }
    catch (e) {
      console.error(e);
      console.error("Maintenance failed");
    }
  }
}

ServerManager.inMaintenance = false;
ServerManager.waitingRequests = [];
ServerManager._onBegin = [];
ServerManager._onEnd = [];

module.exports = ServerManager;
