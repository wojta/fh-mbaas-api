var fhs = require("fh-statsc"),
  assert = require('assert'),
  debug = require('debug')('fh-mbaas-api:stats'),
  config, appname,
  stats_host, stats_port, stats_enabled, fhStats;

module.exports = function(cfg) {
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  appname = cfg.fhapi.appname;
  // fh-stat settings
  if (cfg && cfg.fhstats) {
    stats_host = cfg.fhstats.host;
    stats_port = cfg.fhstats.port;
    stats_enabled = cfg.fhstats.enabled;
  }
  return stats();
};

// $fh.stats()
var stats = function() {
  if (!fhStats) {
    fhStats = fhs.FHStats({host: stats_host, port: stats_port, enabled: stats_enabled});
  }

  function formatStatsName(stat, apiStats) {
    var statsType = (apiStats) ? "api" : "app";
    return appname + '_' + statsType + '_' + stat;
  }

  function inc(stat, apiStats, cb) {
    if ((typeof apiStats === "function") && (!cb)) {
      cb = apiStats;
      apiStats = undefined;
    }

    fhStats.inc(formatStatsName(stat, apiStats), function(err) {
      if (err) debug("Error %s", err);
      if (cb) cb(err);
    });
  }

  function dec(stat, apiStats, cb) {
    if ((typeof apiStats === "function") && (!cb)) {
      cb = apiStats;
      apiStats = undefined;
    }

    fhStats.dec(formatStatsName(stat, apiStats), function(err) {
      if (err) debug("Error %s", err);
      if (cb) cb(err);
    });
  }

  function timing(stat, time, apiStats, cb) {
    if ((typeof apiStats === "function") && (!cb)) {
      cb = apiStats;
      apiStats = undefined;
    }

    fhStats.timing(formatStatsName(stat, apiStats), time, function(err) {
      if (err) debug("Error %s", err);
      if (cb) cb(err);
    });
  }

  function gauge(stat, value, apiStats, cb) {
    if ((typeof apiStats === "function") && (!cb)) {
      cb = apiStats;
      apiStats = undefined;
    }

    fhStats.gauge(formatStatsName(stat, apiStats), value, function(err) {
      if (err) debug("Error %s", err);
      if (cb) cb(err);
    });
  }

  return {
    inc: inc,
    dec: dec,
    timing: timing,
    gauge: gauge
  };
};
