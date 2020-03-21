import React from "react";

const Square = props => {
    let content = ''
    if(props.value){
        content = '';
          if(props.value === "X") {
              content = (<img
              src="times-solid.svg"
              style={{ width: "40px", height: "40px" }}
            ></img>)
          }else{
              content = <img
              src="circle-regular.svg"
              style={{ width: "35px", height: "35px" }}
            ></img>
          }
            
            
          
    }
    return(
        <td>
            <button
            className={`square`}
            onClick={props.onClick}
            style={{ display: "inline-block", alignItems: "center" }}
            >
            {content}            
            </button>
        </td>
    )
}

export default Square;
