import React, { useState } from "react";
import ReactModal from "react-modal";

import { API } from "../../api/index";

ReactModal.setAppElement("#root");

const AddTask = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState({
    company_name: "",
    position: "",
    deadline: "",
    oa_link: "",
    status: "",
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCompanyNameChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      company_name: e.target.value,
    });
  };
  const handlePositionChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      position: e.target.value,
    });
  };
  const handleOaLinkChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      oa_link: e.target.value,
    });
  };
  const handleDeadlineChange = (e) => {
    e.preventDefault();
    setValue({
      ...value,
      deadline: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setShowModal(false);
    addNewTask(props.column.id, value);
    setValue({
      company_name: "",
      position: "",
      deadline: "",
      oa_link: "",
      status: "",
    });
  };
  const addNewTask = (columnId, content) => {
    console.log(Object.keys(props.board.tasks).length < 1);
    const newTaskId =
      Object.keys(props.board.tasks).length < 1
        ? "task-1"
        : `task-${
            parseInt(Object.keys(props.board.tasks).splice(-1)[0][5]) + 1
          }`;
    const column = props.board.columns[columnId];
    const newTaskIds = Array.from(column.taskIds);

    newTaskIds.push(newTaskId);

    const newTask = {
      id: newTaskId,
      company_name: content.company_name,
      position: content.position,
      deadline: "",
      oa_link: "",
      status: props.column.title,
    };

    props.setBoard({
      ...props.board,
      tasks: {
        ...props.board.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...props.board.columns,
        [columnId]: {
          ...props.board.columns[columnId],
          taskIds: newTaskIds,
        },
      },
    });
    API.post("/sheet/insertCompany", newTask)
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <button
          onClick={() => {
            handleOpenModal();
          }}
        >
          Add Company
        </button>
        <ReactModal isOpen={showModal} contentLabel="Add Company">
          <div>
            <h1>Add Job</h1>
            <label>Company Name</label>
            <input
              name="company_name"
              type="text"
              placeholder="Company name"
              value={value.company_name}
              onChange={(e) => handleCompanyNameChange(e)}
            />
            <label>Position</label>
            <input
              name="position"
              type="text"
              placeholder="Position"
              value={value.position}
              onChange={(e) => handlePositionChange(e)}
            />
            {props.column.title === "OA Received" ? (
              <div>
                <label>OA Link</label>
                <input
                  name="oa_link"
                  type="text"
                  placeholder="OA Link"
                  value={value.oa_link}
                  onChange={(e) => handleOaLinkChange(e)}
                />
                <label>Deadline</label>
                <input
                  name="deadline"
                  type="date"
                  placeholder="Deadline"
                  value={value.deadline}
                  onChange={(e) => handleDeadlineChange(e)}
                />
              </div>
            ) : (
              <div></div>
            )}
            <button type="submit" onClick={handleSubmit}>
              Save Job
            </button>
          </div>
          <button onClick={handleCloseModal}>Close Modal</button>
        </ReactModal>
      </div>
    </>
  );
};

export default AddTask;
