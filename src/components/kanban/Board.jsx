import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Column from "./Column";

const Container = styled.div`
  display: flex;
`;

const Board = (props) => {
  const [board, setBoard] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    fetchBoard().then((data) => setBoard(data));
  }, []);

  async function fetchBoard() {
    const response = await axios.get(
      "api/sheet/getAllData",
      {
        //http://localhost:8000/sheet/getAllData
        withCredentials: true,
      }
    );

    const data = await response.data;

    return data.board;
  }

  function onDragEnd() {
    alert("dropped");
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
