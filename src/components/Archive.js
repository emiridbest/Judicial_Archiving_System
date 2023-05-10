import React from "react";

const Archive = ({ documents, getAllDocuments, getDocument }) => {
  const handleGetDocuments = async () => {
    try {
      await getAllDocuments();
    } catch (error) {
      console.error("Error retrieving document list:", error);
    }
  };

  return (
    <div className="docs">
      <h2>Document List</h2>
      <button onClick={handleGetDocuments}>Refresh List</button>
      <table>
        <thead>
          <tr>
            <th>Document ID</th>
            <th>Title</th>
            <th>Document Identifier</th>
            <th>Time Modified</th>
          </tr>
        </thead>
        <tbody>
          {documents &&
            Array.isArray(documents) &&
            documents.map((document, index) => (
              <tr key={index}>
                <td>{document.id}</td>
                <td>{document.title}</td>
                <td>{document.pinataCID}</td>
                <td>{new Date(document.timestamp * 1000).toLocaleString()}</td>
                <td>
                  <button onClick={() => getDocument(document.id)}>
                    Retrieve document
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Archive;
