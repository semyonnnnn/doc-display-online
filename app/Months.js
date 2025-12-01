export const Months = {
  months: [
    { name: "Январь", days: 31 },
    { name: "Февраль", days: 28 },
    { name: "Март", days: 31 },
    { name: "Апрель", days: 30 },
    { name: "Май", days: 31 },
    { name: "Июнь", days: 30 },
    { name: "Июль", days: 31 },
    { name: "Август", days: 31 },
    { name: "Сентябрь", days: 30 },
    { name: "Октябрь", days: 31 },
    { name: "Ноябрь", days: 30 },
    { name: "Декабрь", days: 31 },
  ],
  columnsPerMonth: 6,

  getColWidth(visibleMonths = 12) {
    return 100 / (visibleMonths * this.columnsPerMonth);
  },

  timelinePosition(
    startMonthIndex,
    startDay,
    durationDays,
    visibleStartMonth = 1,
    visibleMonths = 6
  ) {
    // relative to the visible window
    const colWidth = this.getColWidth(visibleMonths);

    // start column relative to visibleStartMonth
    let startColumn = 0;
    for (let m = visibleStartMonth - 1; m < startMonthIndex - 1; m++) {
      startColumn += this.columnsPerMonth;
    }

    // add partial days in first month
    const daysInMonth = this.months[startMonthIndex - 1].days;
    startColumn += (startDay / daysInMonth) * this.columnsPerMonth;

    // calculate width in columns (clamp to visible window)
    let widthColumns = (durationDays * this.columnsPerMonth) / daysInMonth;

    // adjust if bar exceeds visible window
    const visibleEndMonth = visibleStartMonth + visibleMonths - 1;
    if (
      startMonthIndex + widthColumns / this.columnsPerMonth - 1 >
      visibleEndMonth
    ) {
      const overflowColumns =
        startMonthIndex +
        widthColumns / this.columnsPerMonth -
        1 -
        visibleEndMonth;
      widthColumns -= overflowColumns * this.columnsPerMonth;
    }

    return {
      left: startColumn * colWidth + "%",
      width: widthColumns * colWidth + "%",
    };
  },
};
