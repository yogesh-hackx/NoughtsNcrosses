import React,{useState} from "react";

const Square = props => {
    let content = ''
    const [priv,setPriv]=useState("")
    console.log(props);
    const mouseEnterHandler = () =>{
   if(props.myTurn)
    {
      if(props.myPiece==='X')
      {
        
              setPriv (<img
              src="times-solid.svg"
              style={{ opacity:"0.2", width: "40px", height: "40px" }}
            ></img>)
         }else{
              setPriv ( <img
              src="circle-regular.svg"
              style={{ opacity:"0.2", width: "35px", height: "35px" }}
            ></img>)
          }}
        }
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
            onMouseEnter={()=>mouseEnterHandler()}
            onMouseLeave={()=>setPriv("")}
            style={{ display: "inline-block", alignItems: "center" }}
            >
            {content||priv}            
            </button>
        </td>
    )
}

export default Square;

