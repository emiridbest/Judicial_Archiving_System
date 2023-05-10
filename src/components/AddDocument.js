import React, { useState } from "react";

const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_API_SECRET;

const Input = ({ placeholder, name, type, value, handleChange, id }) => (
  <input
    id={id}
    name={name}
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e) => handleChange(e)}
    className=""
  />
);

const AddDocument = ({ addDocument }) => {
  const [title, setTitle] = useState("");
  const [pinataCid, setPinataCid] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      default:
        console.error(`Invalid input field name: ${name}`);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("File added to IPFS with CID:", result.IpfsHash);
      setPinataCid(result.IpfsHash);
    } else {
      console.error("Error uploading file to IPFS:", response.status);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !pinataCid) return;

    addDocument(title, pinataCid);
  };

  return (
    <div className="add">
            <label className="">Add Document</label>

      <div className="">
        <Input
          placeholder="Documment Title"
          name="title"
          type="text"
          value={title}
          handleChange={handleChange}
        />
        <input
          placeholder="pdf here"
          type="file"
          id="pdfFileInput"
          accept="application/pdf"
          onChange={handleFileChange}
          className="white-glassmorphism"
        />
      </div>
      <div />
      <button type="button" onClick={handleSubmit}>
        Add Document
      </button>
    </div>
  );
};

export default AddDocument;
