import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { getUser } from "../../actions/users";
import { createSheet, getSheetId } from "../../actions/sheets";

const Homepage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const sheet_state = useSelector((state) => state.sheet.sheetId.sheet_id);

  const createNewSheet = () => {
    dispatch(createSheet());
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSheetId());
  }, [dispatch, sheet_state]);

  return (
    <div>
      Welcome To App Buddy
      <div>Homepage</div>
      {user ? (
        <div>
          <div>
            <div>Welcome {user.displayName}</div>
          </div>
          <div>
            {sheet_state ? (
              <div>
                <div>Sheet Id: {sheet_state}</div>
                <div>
                  <Link to="/kanban">Kanban Board</Link>
                </div>
              </div>
            ) : (
              <button onClick={createNewSheet}>Create Google Sheet</button>
            )}
          </div>
          <div>
            <Link to="/mail">Show Mail</Link>
          </div>
        </div>
      ) : (
        <div>Please Login</div>
      )}
    </div>
  );
};

export default Homepage;
