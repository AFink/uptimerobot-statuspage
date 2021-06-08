import request from "request";
import moment from "moment";

const config = require("../config.json");

async function setIds() {
  let ids = [];
  Object.entries(config.monitors).forEach((member) => {
    const [name, members] = member;
    members.forEach((m) => {
      if (m.type == "uptimerobot") {
        ids.push(m.id);
      }
    });
  });
  let unique = ids.filter(function (elem, pos) {
    return ids.indexOf(elem) == pos;
  });
  options.form.monitors = unique.join("-");
  return true;
}

var options = {
  method: "POST",
  url: "https://api.uptimerobot.com/v2/getMonitors",
  headers: {
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
  },
  form: {
    api_key: config.uptimerobot || "",
    format: "json",
    logs: "1",
    custom_uptime_ratios: "1-7-30-90",
    monitors: "",
  },
  json: true,
};

let beforeRequest = moment();

export async function getMonitors() {
  await setIds();
  let d = await new Promise((resolve, reject) => {
    beforeRequest = moment();
    request(options, function (error, response, body) {
      if (error) reject(error);
      //console.log(body);
      resolve(transformAnswer(body));
    });
  });
  return JSON.parse(JSON.stringify(d));
}

export async function getMonitor(slug) {
  let monitor = null;
  Object.entries(config.monitors).forEach((member) => {
    const [name, members] = member;
    let found = members.find((me) => me.id == slug);
    if (found) monitor = found;
  });

  switch (monitor.type) {
    case "uptimerobot":
      let data = await new Promise((resolve, reject) => {
        let o2 = options;
        o2.form.monitors = monitor.id;
        o2.form.response_times = 1;

        beforeRequest = moment();
        request(o2, function (error, response, body) {
          if (error) reject(error);

          resolve(body);
        });
      });
      let m = data.monitors.find((mo) => {
        return mo.id == monitor.id;
      });
      //console.log(m);
      let uptimes = m["custom_uptime_ratio"].split("-");
      return {
        name: m.friendly_name,
        slug: m.id,
        status: m.status,
        dailyRatios: createDaily(m.logs, 90),
        uptime: {
          1: Number(uptimes[0]),
          7: Number(uptimes[1]),
          30: Number(uptimes[2]),
          90: Number(uptimes[3]),
        },
        dailyResponsetime: m["response_times"].reverse().map((rt) => {
          return {
            unix: rt.datetime,
            time: moment.unix(rt.datetime).format("HH:mm"),
            value: rt.value,
          };
        }),
        responsetime: {
          avg: m["average_response_time"],
          min: Math.min(...m["response_times"].map((rt) => rt.value)),
          max: Math.max(...m["response_times"].map((rt) => rt.value)),
        },
      };
      break;

    default:
      break;
  }
}

function transformAnswer(data) {
  return Object.entries(config.monitors).map((member) => {
    const [name, members] = member;

    let a = members.map((me) => {
      switch (me.type) {
        case "uptimerobot":
          // data.monitors.map((x) => console.log(x));
          let m = data.monitors.find((mo) => {
            return mo.id == me.id;
          });
          if (!m) return {};
          let uptimes = m["custom_uptime_ratio"].split("-");
          return {
            name: m.friendly_name,
            slug: m.id,
            status: m.status,
            dailyRatios: createDaily(m.logs),
            uptime: {
              1: Number(uptimes[0]),
              7: Number(uptimes[1]),
              30: Number(uptimes[2]),
              90: Number(uptimes[3]),
            },
          };
          break;
        default:
          break;
      }
    });

    return {
      name: name,
      monitors: a,
    };
  });
}

function createDaily(logs, count = 30) {
  let days = [];

  for (let index = count; index > -1; index--) {
    days.push(index);
  }

  return days.map((d) => {
    let xx = getUptime(logs, d);
    //if (xx < 0) console.log(xx);
    return {
      uptime: xx,
      date: moment().subtract(d, "days").format("MMMM Do, YYYY"),
    };
  });
}

function getUptime(logs, d) {
  let up = 0,
    down = 0,
    paused = 0;

  let dateStart = moment().subtract(d, "days").startOf("day");

  const started = moment().unix(logs.find((l) => l.type == 98).timestamp);
  if (dateStart.isBefore(started)) {
    dateStart = started;
  }

  let dateEnd = moment().subtract(d, "days").endOf("day");
  if (dateEnd.isAfter(beforeRequest)) {
    dateEnd = beforeRequest;
  }

  let log = logs.filter((l) => {
    let start = moment.unix(l.datetime);
    let end = moment.unix(l.datetime).add(l.duration, "seconds");

    let inside = start.isBefore(dateStart) && end.isAfter(dateEnd);
    let startIn = start.isAfter(dateStart) && start.isBefore(dateEnd);
    let endIn = end.isAfter(dateStart) && end.isBefore(dateEnd);
    return inside || startIn || endIn;
  });
  log = log.filter((l) => {
    let start = moment.unix(l.datetime);
    let end = moment.unix(l.datetime).add(l.duration, "seconds");

    if (end.isBefore(dateStart) || start.isAfter(dateEnd)) {
      return false;
    }
    return true;
  });

  log.forEach((l) => {
    let start = moment.unix(l.datetime);
    let end = moment.unix(l.datetime).add(l.duration, "seconds");

    if (start.isBefore(dateStart)) {
      start = dateStart;
    }
    if (end.isAfter(dateEnd)) {
      end = dateEnd;
    }
    let difff = moment.duration(end.diff(start, true)).asSeconds();
    switch (l.type) {
      case 1:
        down = down + difff;
        break;
      case 2:
        up = up + difff;
        break;
      case 99:
        paused = paused + difff;
        break;
      default:
        //TODO
        //console.log(l);
        break;
    }
  });
  const secondsInDay = moment
    .duration(dateEnd.diff(dateStart, true))
    .asSeconds();

  return {
    up: (up / secondsInDay) * 100,
    down: (down / secondsInDay) * 100,
    paused: (paused / secondsInDay) * 100,
  };
}
