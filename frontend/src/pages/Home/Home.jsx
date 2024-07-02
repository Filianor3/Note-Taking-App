import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Note from "../../components/Cards/Note";
import AddEditNotes from "./NotePop";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../backend/axiosInstance";
import moment from "moment";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const getuserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("error happened", error);
      }
    }
  };

  const getNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("ver wamovighe yvela note, samwuxarod");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        getNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("unexcpected error");
      }
    }
  };

  const editNote = async (noteId, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/edit-note/${noteId}`,
        updatedData
      );
      if (response.data && response.data.success) {
        getNotes();
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
    getNotes();
  };

  const getUsersMap = async () => {
    try {
      const response = await axiosInstance.get("/get-all-users");
      if (response.data && response.data.users) {
        const users = response.data.users;
        const usersMapped = {};
        users.forEach((user) => {
          usersMapped[user._id] = user.name; // Mapping userId to username
        });
        setUsersMap(usersMapped);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const changePublicity = async (noteId) => {
    const noteToUpdate = allNotes.find((note) => note._id === noteId);
    if (!noteToUpdate) return;

    const updatedNote = {
      ...noteToUpdate,
      publicity: !noteToUpdate.publicity, // Toggle the publicity flag
    };

    editNote(noteId, updatedNote);
  };

  const searchNote = async (query) => {
    try {
      const resp = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (resp.data && resp.data.notes) {
        setIsSearch(true);
        setAllNotes(resp.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  const clearSearchNote = () => {
    setIsSearch(false);
    getNotes();
  };

  useEffect(() => {
    getNotes();
    getUsersMap();
    getuserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        handleSearch={searchNote}
        onClearSearchBar={clearSearchNote}
      />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) =>
            !item.publicty ? (
              <Note
                key={item._id}
                header={`${item.header} - ${usersMap[item.userId]}`}
                date={moment(item.date).format("Do MMM YYYY")}
                description={item.description}
                publicity={item.publicity}
                onEdit={() => {
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: item,
                  });
                }}
                onDelete={() => deleteNote(item)}
                changePublicity={() => changePublicity(item._id)}
                isOwner={userInfo?._id === item.userId}
              />
            ) : null
          )}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-500 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[30px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-24 p-5 overflow-scroll"
        ariaHideApp={false}
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getNotes={getNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
