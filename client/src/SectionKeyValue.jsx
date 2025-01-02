import "./css/Styles.css";
import React from "react";

function SectionKeyValue(props) {
  return (
    <div className="key-value-pair mb-2 row g-2 align-items-center">
      <div className="col">
        <input
          type="text"
          name="key[]"
          className="form-control"
          placeholder="Key (e.g. Position)"
          value="${key}"
          required
        />
      </div>
      <div className="col">
        <input
          type="text"
          name="value[]"
          className="form-control"
          placeholder="Value (e.g. Developer)"
          value="${value}"
          required
        />
      </div>
      <div className="col-auto">
        <button type="button" className="btn btn-danger remove-key-value-btn">
          Remove
        </button>
      </div>
    </div>
  );
}

export default SectionKeyValue;
