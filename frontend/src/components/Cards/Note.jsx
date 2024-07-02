import React from "react";
import {
  MdLockOutline,
  MdOutlinePublic,
  MdCreate,
  MdDelete,
} from "react-icons/md";

const Note = ({
  header,
  date,
  description,
  categories,
  publicity,
  onEdit,
  onDelete,
  changePublicity,
  isOwner,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transation-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{header}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>

        {isOwner &&
          (publicity ? (
            <MdOutlinePublic
              className="hover:text-blue-500"
              onClick={changePublicity}
            />
          ) : (
            <MdLockOutline
              className="hover:text-blue-500"
              onClick={changePublicity}
            />
          ))}
      </div>

      <p className="text-xs text-slate-600 mt-2">{description?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        {isOwner && (
          <div className="flex items-center gap-2">
            <MdCreate className="hover:text-blue-500" onClick={onEdit} />
            <MdDelete className="hover:text-red-500" onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
