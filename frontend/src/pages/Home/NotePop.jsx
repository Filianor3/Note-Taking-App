import React, { useState } from "react";
import axiosInstance from "../../../../backend/axiosInstance";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type, getNotes, onClose }) => {
  const [header, setHeader] = useState(noteData?.header || "");
  const [description, setDescription] = useState(noteData?.description || "");
  const [error, setError] = useState(null);

  const handleAdd = () => {
    if (!header) {
      setError("pls enter the header");
      return;
    }

    if (!description) {
      setError("pls enter description");
      return;
    }

    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNote();
    }
  };

  const addNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        header,
        description,
      });
      if (response.data && response.data.note) {
        getNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        header,
        description,
      });
      if (response.data && response.data.note) {
        getNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">HEADER</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="header:)"
          value={header}
          onChange={({ target }) => setHeader(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">DESCRIPTION</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="descr"
          rows={10}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="button-primary font-medium mt-5 p-3"
        onClick={handleAdd}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
