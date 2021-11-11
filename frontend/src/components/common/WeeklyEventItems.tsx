import React from 'react';

type DefaultWeeklyEventItemProps = {
  title: string;
  date: string;
};

const DefaultWeeklyEventItem = ({
  title,
  date,
}: DefaultWeeklyEventItemProps) => {
  return (
    <li>
      <div>
        <h3>{title}</h3>
        <p>{date}</p>
      </div>
    </li>
  );
};

export default DefaultWeeklyEventItem;