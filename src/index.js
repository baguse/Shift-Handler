import moment from "moment";

const SHIFT = {
  CIRACAS: {
    "SHIFT 1": [
      "06:30:00",
      "07:30:00",
      "08:30:00",
      "09:30:00",
      "10:30:00",
      "11:30:00",
      "12:30:00",
      "13:30:00",
      "14:29:59"
    ],
    "SHIFT 2": [
      "14:30:00",
      "15:30:00",
      "16:30:00",
      "17:30:00",
      "18:30:00",
      "19:30:00",
      "20:30:00",
      "21:30:00",
      "22:29:59"
    ],
    "SHIFT 3": [
      "22:30:00",
      "23:30:00",
      "00:30:00",
      "01:30:00",
      "02:30:00",
      "03:30:00",
      "04:30:00",
      "05:30:00",
      "06:29:59"
    ]
  },
  SENTUL: {
    "SHIFT 1": [
      "07:00:00",
      "08:00:00",
      "09:00:00",
      "10:00:00",
      "11:00:00",
      "12:00:00",
      "13:00:00",
      "14:00:00",
      "14:59:59"
    ],
    "SHIFT 2": [
      "15:00:00",
      "16:00:00",
      "17:00:00",
      "18:00:00",
      "19:00:00",
      "20:00:00",
      "21:00:00",
      "22:00:00",
      "22:59:59"
    ],
    "SHIFT 3": [
      "23:00:00",
      "00:00:00",
      "01:00:00",
      "02:00:00",
      "03:00:00",
      "04:00:00",
      "05:00:00",
      "06:00:00",
      "06:59:59"
    ]
  },
  SMALL_SACHET_SPRAY_DRYER: {
    "SHIFT 1": [
      "07:00:00",
      "08:00:00",
      "09:00:00",
      "10:00:00",
      "11:00:00",
      "12:00:00",
      "13:00:00",
      "14:00:00",
      "14:59:59"
    ],
    "SHIFT 2": [
      "15:00:00",
      "16:00:00",
      "17:00:00",
      "18:00:00",
      "19:00:00",
      "20:00:00",
      "21:00:00",
      "22:00:00",
      "22:59:59"
    ],
    "SHIFT 3": [
      "23:00:00",
      "00:00:00",
      "01:00:00",
      "02:00:00",
      "03:00:00",
      "04:00:00",
      "05:00:00",
      "06:00:00",
      "06:59:59"
    ]
  }
};

const generateShift = (time, plant) => {
  const now = moment(time, "HH:mm:ss");
  const shiftCiracas = [
    {
      name: 1,
      start: moment("06:30:00", "HH:mm:ss"),
      end: moment("14:29:59", "HH:mm")
    },
    {
      name: 2,
      start: moment("14:30:00", "HH:mm:ss"),
      end: moment("22:29:59", "HH:mm:ss")
    },
    {
      name: 3,
      start: moment("22:30:00", "HH:mm:ss"),
      end: moment("06:29:59", "HH:mm:ss")
    }
  ];
  const shiftSentul = [
    {
      name: 1,
      start: moment("07:00:00", "HH:mm:ss"),
      end: moment("14:59:59", "HH:mm:ss")
    },
    {
      name: 2,
      start: moment("15:00:00", "HH:mm:ss"),
      end: moment("22:59:59", "HH:mm:ss")
    },
    {
      name: 3,
      start: moment("23:00:00", "HH:mm:ss"),
      end: moment("06:59:59", "HH:mm:ss")
    }
  ];
  const shiftSssd = [
    {
      name: 1,
      start: moment("07:00:00", "HH:mm:ss"),
      end: moment("14:59:59", "HH:mm:ss")
    },
    {
      name: 2,
      start: moment("15:00:00", "HH:mm:ss"),
      end: moment("22:59:59", "HH:mm:ss")
    },
    {
      name: 3,
      start: moment("23:00:00", "HH:mm:ss"),
      end: moment("06:59:59", "HH:mm:ss")
    }
  ];
  let SHIFT;
  switch (plant.toUpperCase()) {
    case "SENTUL":
      SHIFT = shiftSentul;
      break;
    case "CIRACAS":
      SHIFT = shiftCiracas;
      break;
    case "SMALL_SACHET_SPRAY_DRYER":
      SHIFT = shiftSssd;
      break;
  }

  return SHIFT.filter(({ start, end, name }) => {
    // if jika shift 1 / 2
    if (now >= start && now <= end) {
      return true;
    }

    if (
      (now >= start && now <= moment("24:00:00", "HH:mm:ss")) ||
      (now <= end && now >= moment("00:00:00", "HH:mm:ss"))
    ) {
      if (name === 3) {
        return true;
      }
    }
    return false;
  })[0].name;
};

const getShiftTime = (plantName, shift, baseTime = null) => {
  const shiftList = SHIFT[plantName.toUpperCase()][`SHIFT ${shift}`];
  let startTime,
    endTime = null;

  const shiftNow = generateShift(
    moment().format("HH:mm:ss"),
    plantName.toLowerCase()
  );

  const baseDate = baseTime ? baseTime : moment().format("YYYY-MM-DD");

  if (shiftNow == 3) {
    if (baseTime) {
      const mBasetime = moment(baseTime, "YYYY-MM-DD");
      startTime = moment(`${baseTime} ${shiftList[0]}`, "YYYY-MM-DD HH:mm:ss");
      startTime = moment(
        `${mBasetime.add(1, "days").format("YYYY-MM-DD")} ${
          shiftList[shiftList.length - 1]
        }`,
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      if (
        moment() >= moment("00:00:00", "HH:mm:ss") &&
        moment() <= moment(shiftList[shiftList.length - 1], "HH:mm:ss")
      ) {
        startTime = moment(shiftList[0], "HH:mm:ss").subtract(1, "days");
        endTime = moment(shiftList[shiftList.length - 1], "HH:mm:ss");
      } else {
        startTime = moment(shiftList[0], "HH:mm:ss");
        endTime = moment(shiftList[shiftList.length - 1], "HH:mm:ss").add(
          1,
          "days"
        );
      }
    }
  } else {
    startTime = moment(`${baseDate} ${shiftList[0]}`, "YYYY-MM-DD HH:mm:ss");
    endTime = moment(
      `${baseDate} ${shiftList[shiftList.length - 1]}`,
      "YYYY-MM-DD HH:mm:ss"
    );
  }

  return { startTime, endTime };
};

const currentShift = generateShift("18:00:00", "CIRACAS");

console.log({ currentShift });
const { startTime, endTime } = getShiftTime("CIRACAS", 3);
console.log({
  startTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
  endTime: endTime.format("YYYY-MM-DD HH:mm:ss")
});
