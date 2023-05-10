import React from "react";

const Input = ({ placeholder, name, type, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    name={name} // Add the 'name' attribute here
    onChange={(e) => handleChange(e, name)}
    className=""
  />
);

const AssignRole = ({ formData, assignRole, handleChange }) => {
  const handleSubmit = (e) => {
    const { address, role } = formData;
    e.preventDefault();
    if (!address || !role) return;
    console.log("Submitting:", formData); // Add a console log here to see the formData
    assignRole(address, role);
  };

  return (
    <div className="add">
      <label className="">Roles</label>

      <div className="">
        <Input
          placeholder="Address"
          name="address"
          type="text"
          handleChange={handleChange}
        />
        <select
          name="role"
          onChange={(e) => handleChange(e, "role")}
          className="role"
        >
          <option value="Admin">Admin</option>
          <option value="licencedUser">licencedUser</option>
        </select>
      </div>
      <div />
      <button type="button" onClick={handleSubmit}>
        Assign Role
      </button>
    </div>
  );
};

export default AssignRole;
