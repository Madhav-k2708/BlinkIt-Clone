import React from "react";
import { IoClose } from "react-icons/io5";

const AddFieldDetails = ({close, value, onChange,submit}) => {
  return (

    <section className="fixed inset-0 bg-neutral-900 px-4 bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white rounded p-4  w-full max-w-md ">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold  ">Add Field</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <input
          type="text"
          className="bg-blue-50 my-3 p-2 border outline-none focus-within:border-primary-100 w-full"
          placeholder="Enter Filed Name"
          value={value}
          onChange={onChange}
        />
        <button onClick={submit} className="bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block ">Add Field</button>
      </div>
    </section>
  );
};

export default AddFieldDetails;
