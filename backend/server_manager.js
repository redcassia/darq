var cron = require('node-cron');

class ServerManager {
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
      console.log("Starting scheduled maintenance");

      try {
        this._beginMaintenance();
        await maintenanceFunc();
        this._endMaintenance();

        console.log("Scheduled maintenance completed");
      }
      catch (e) {
        console.error(e);
        console.error("Scheduled maintenance failed");
      }
    });
  }

  static async doMaintenanceNow(maintenanceFunc) {
    console.log("Starting maintenance");

    try {
      this._beginMaintenance();
      await maintenanceFunc();
      this._endMaintenance();
  
      console.log("Maintenance completed");
    }
    catch (e) {
      console.error(e);
      console.error("Maintenance failed");
    }
  }
}

ServerManager.inMaintenance = false;
ServerManager.waitingRequests = [];

module.exports = ServerManager;
