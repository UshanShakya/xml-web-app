import './css/Styles.css';
import React from 'react';
import SectionKeyValue from './SectionKeyValue';

function Section(props) {

  return (
        <div className="section card mb-3 p-3 border-primary">
        <div className="mb-3 card-header">
            <h5>Section Name</h5>
            <input type="text" name="sectionName" className="form-control" value="" placeholder="Section Name" required/>
        </div>
        <div className="key-value-container">
          {props.section.keyValues?.map((kv, index) => {
            <SectionKeyValue key={index} keyValue={kv}/>
          })
          }
        </div>
        <div className="f-spaced-evenly">
            <button type="button" className="btn btn-secondary add-key-value-btn" onClick={()=>props.addNewSectionKeyValue(props.section.index)}>Add Key-Value Pair</button>
            <button type="button" className="btn btn-danger remove-section-btn" onClick={()=>props.removeSection(props.section.index)}>Remove Section</button>
        </div>
    </div>
  );
}

export default Section;