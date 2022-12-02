import React, { useState } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import ReactModal from "react-modal";

import { API } from "../../api/index";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

ReactModal.setAppElement("#root");

const Task = (props) => {
  console.log(props.task);
  const deleteTask = (columnId, index, taskId) => {
    const column = props.board.columns[columnId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(index, 1);

    const tasks = props.board.tasks;
    const { [taskId]: oldTask, ...newTasks } = tasks;
    props.setBoard({
      ...props.board,
      tasks: {
        ...newTasks,
      },
      columns: {
        ...props.board.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });

    API.post("/sheet/deleteCompany", props.task)
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const handleOpenModal = (task) => {
    console.log(task);
    setShowModal(true);
    setModalData(task);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({});
  };

  return (
    <>
      <Draggable draggableId={`${props.task.id}`} index={props.index}>
        {(provided) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => handleOpenModal(props.task)}
          >
            {props.task.company_name}
            <span
              style={{ marginLeft: "15px" }}
              onClick={() => {
                deleteTask(props.columnId, props.index, props.task.id);
              }}
            >
              X
            </span>
          </Container>
        )}
      </Draggable>
      <ReactModal isOpen={showModal}>
        <button onClick={handleCloseModal}>Close</button>
        <h1> Company Name : {modalData.company_name}</h1>
        <h2>Position : {modalData.position}</h2>
        {modalData.oa_link ? (
          <div>
            <h2>
              OA Email Link :{" "}
              <a href={modalData.oa_link} target="_blank" rel="noreferrer">
                Click to open email
              </a>
            </h2>
            <h2>Deadline : {modalData.deadline}</h2>
          </div>
        ) : (
          <div></div>
        )}
      </ReactModal>
    </>
  );
};

export default Task;
