import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";


const DynamicDropdown = ({invoicesData, newValues, name}) => {
    const [custom, setCustom] = useState(false);
    const [newData , setNewData] = useState("");

    
      
        useEffect(() => {
            newValues({target:name, data:newData}) 
            // eslint-disable-next-line
          }, [newData])


    
        const editField = (e) => {
        if (e.target.value === "custom") {
            setCustom(true);
        } else {
            setNewData(e.target.value);
            newValues({target:name, data:newData});  
        }
        }
  return (

    <div>
        {custom?(
            <Form.Control
            placeholder={name}
            rows={3}
            value={newData? newData: ""}
            type="text"
            name={name}
            className="my-2"
            onChange={editField}
            required
          />
          
        )
        :(

            <Form.Select
            value={newData}
            onChange={ editField}
            >
            {invoicesData.map((invoice) => (
              
                <option key={invoice.id} value={invoice[name]}>
                {invoice[name]}
                </option>
            ))}
            <option value="custom">--Type --</option>
            </Form.Select>
        )}
    </div>

  )
}

export default DynamicDropdown