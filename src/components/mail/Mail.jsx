import React, { useEffect, useState } from "react";

import { API } from "../../api/index";

const Mail = () => {
  const [mail, setMails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const data = await API.get("mail/getMail");

      setMails(data.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div>
      <div>Mail</div>
      <div>
        <p>{mail.mail}</p>
      </div>
    </div>
  );
};

export default Mail;
