
import { useState } from 'react';
import './css/Styles.css';
import Section from './Section';

function AdminIndex() {
  const [sectionList, setSectionList] = useState([]);
  const [sectionCount, setSectionCount] = useState(1);
  
  const sectionObj = {
    index: 0,
    sectionName: "",
    keyValues: [],
  };

  const addNewSection = () => {
    setSectionList([...sectionList, { ...sectionObj, index: sectionCount }]);
    setSectionCount(sectionCount+1);
  }

  const removeSection = (index) => {
    setSectionList(sectionList.filter(section => section.index !== index));
  }

  const addNewSectionKeyValue = (index) => {
    setSectionList(sectionList.map(section => {
      if (section.index === index) {
        return {
          ...section,
          keyValues: [...section.keyValues, { key: "", value: "" }]
        };
      }
      return section;
    }));
  };

  const removeNewSectionKeyValue = (index, key) => {
    setSectionList(sectionList.map(section => {
      if (section.index === index) {
        return {
          ...section,
          keyValues: section.keyValues.filter(kv => kv.key !== key)
        };
      }
      return section;
    }));
  };
  
  return (
    <div className="container my-4">
      <form id="dynamic-form">
        <div id="sections-container" className="mb-3">
          {
            sectionList?.map((section, index) => (
              <Section key={index} section={section} removeSection={removeSection} addNewSectionKeyValue= {addNewSectionKeyValue} removeNewSectionKeyValue={removeNewSectionKeyValue}/>))
          }
        </div>
        <div className="key-value-pair mb-2 row g-2 f-spaced-evenly">
          <button type="button" id="add-section-btn" className="btn btn-primary" onClick={addNewSection}>Add New Section</button>
          <button type="button" id="save-btn" className="btn btn-success">Save XML</button>
        </div>
      </form>
    </div>

  );
}

export default AdminIndex;
