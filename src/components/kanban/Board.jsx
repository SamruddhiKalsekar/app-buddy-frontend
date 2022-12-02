import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Column from "./Column";
import { API } from "../../api/index";

const Container = styled.div`
  
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Board = (props) => {
  const [board, setBoard] = useState({
    tasks: {},
    columns: {
      "column-1": {
        id: "column-1",
        title: "Applied",
        taskIds: [],
      },
      "column-2": {
        id: "column-2",
        title: "OA Received",
        taskIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "Interview",
        taskIds: [],
      },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
  });

  useEffect(() => {
    fetchBoard().then((data) => {
      setBoard(data);
    });
  }, []);
  async function fetchBoard() {
    const response = await API.get("sheet/getAllData");

    const data = await response.data;

    return data.board;
  }

  function onDragEnd(result) {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(board.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setBoard({
        ...board,
        columnOrder: newColumnOrder,
      });
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    updateDrag(start.taskIds[source.index], finish.title);

    const newStartColumn = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinishColumn = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setBoard({
      ...board,
      columns: {
        ...board.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
    return;
  }

  function updateDrag(taskid, status) {
    let data = { ...board.tasks[taskid], newStatus: status };
    API.post("/sheet/updateStatus", data)
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {board.columnOrder.map((columnId, index) => {
                const column = board.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskIds) => board.tasks[taskIds]
                );
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    board={board}
                    setBoard={setBoard}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Board;
