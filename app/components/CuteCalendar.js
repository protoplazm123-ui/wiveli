"use client";

import { useMemo, useState } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad = (number) => String(number).padStart(2, "0");

const toValue = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function CuteCalendar({
  value,
  onChange,
  onClose,
}) {
  const selectedDate = value
    ? new Date(`${value}T12:00:00`)
    : null;

  const today = new Date();

  const [visibleDate, setVisibleDate] = useState(
    selectedDate || today
  );

  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // JS: Sunday = 0.
    // We want Monday = first column.
    const mondayIndex = (firstDay.getDay() + 6) % 7;

    const totalCells = 42;
    const result = [];

    for (let index = 0; index < totalCells; index++) {
      const dayNumber = index - mondayIndex + 1;

      const date = new Date(year, month, dayNumber);

      result.push({
        date,
        day: date.getDate(),
        currentMonth: date.getMonth() === month,
      });
    }

    return result;
  }, [year, month]);

  const changeMonth = (amount) => {
    setVisibleDate(
      new Date(year, month + amount, 1)
    );
  };

  const selectDate = (date) => {
    onChange(
      toValue(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

    if (onClose) {
      setTimeout(onClose, 180);
    }
  };

  const chooseToday = () => {
    onChange(
      toValue(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
    );

    setVisibleDate(today);

    if (onClose) {
      setTimeout(onClose, 180);
    }
  };

  const clearDate = () => {
    onChange("");
  };

  return (
    <div className="cuteCalendar">
      <div className="cuteCalendarTop">
        <div>
          <p>SELECT A DATE</p>
          <span>A special day ahead ♡</span>
        </div>

        {onClose && (
          <button
            className="cuteCalendarClose"
            type="button"
            onClick={onClose}
            aria-label="Close calendar"
          >
            ×
          </button>
        )}
      </div>

      <div className="cuteCalendarMonth">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>

        <h3>{monthName}</h3>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="cuteCalendarWeek">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="cuteCalendarDays">
        {days.map(({ date, day, currentMonth }) => {
          const isSelected =
            selectedDate && sameDay(date, selectedDate);

          const isToday = sameDay(date, today);

          return (
            <button
              type="button"
              key={date.toISOString()}
              className={[
                "cuteCalendarDay",
                !currentMonth ? "outside" : "",
                isSelected ? "selected" : "",
                isToday ? "today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => selectDate(date)}
            >
              <span>{day}</span>

              {isSelected && (
                <i className="calendarTinyHeart">♥</i>
              )}
            </button>
          );
        })}
      </div>

      <div className="cuteCalendarBottom">
        <button
          type="button"
          onClick={chooseToday}
        >
          <span>♡</span>
          Today
        </button>

        <button
          type="button"
          onClick={clearDate}
        >
          <span>♡</span>
          Clear
        </button>
      </div>

      {value && (
        <div className="cuteCalendarSelected">
          <div>
            <span>SELECTED DATE</span>

            <strong>
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(selectedDate)}
            </strong>
          </div>

          <button
            type="button"
            onClick={clearDate}
            aria-label="Clear selected date"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
